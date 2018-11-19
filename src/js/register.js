function init() {
    const BASE_URL = "http://test.bits-apogee.org/2019";
    setColleges();

    document.getElementById("open-register").addEventListener("click", function (e) {
        e.preventDefault();
        openReg();
    });

    document.getElementById("register-back").addEventListener("click", function (e) {
        e.preventDefault();
        closeReg();
    });

    function openReg() {
        displayError('');
        document.getElementById("register").style.top = 0;
        document.getElementById("nav-content").style.opacity = 0;
        setTimeout(function(){
            document.getElementById("register-cross-svg").style.display = 'block';
            document.getElementById("nav-content").style.display = 'none';
        }, 300);
        inlineSvgColorHandler("apogee-logo-svg", "#fff");
        // document.getElementById("campus-ambassador-content").style.opacity = 0;
        // setTimeout(function () {
        //     document.getElementById("campus-ambassador-content").style.display = "none";
        //     document.getElementById("register").style.display = "block";
        // }, 270);
        // setTimeout(function () {
        //     document.getElementById("register").style.opacity = 1;
        // }, 300);
    }

    function closeReg() {
        document.getElementById("register").style.top = '100%';
        document.getElementById("nav-content").style.display = 'flex';
        setTimeout(function(){
            document.getElementById("nav-content").style.opacity = 1;
            document.getElementById("register-cross-svg").style.display = 'none';
        }, 100);
        // setTimeout(function () {
        //     document.getElementById("register").style.display = "none";
        //     document.getElementById("campus-ambassador-content").style.display = "block";
        // }, 270);
        // setTimeout(function () {
        //     document.getElementById("campus-ambassador-content").style.opacity = 1;
        // }, 300);
    }

    document.getElementById("register-form").onsubmit = function (e) {
        e.preventDefault();

        const name = document.getElementById('register-name').value;
        const college = document.getElementById("register-college").value;
        const email = document.getElementById('register-email').value;
        const phone = document.getElementById('register-phone').value;
        const city = document.getElementById('register-city').value;
        let gender = '';

        // get gender
        const genders = document.getElementsByClassName('gender-option');
        for (let i = 0; i < genders.length; i++) {
            if (genders[i].checked)
                gender = genders[i].value;
        }

        if (name.trim() === '') {
            displayError('Please enter your name');
        } else if (city.trim() === '') {
            displayError('Please enter your city');
        } else if (gender === '') {
            displayError('Please select your gender')
        } else if (college === 'select') {
            displayError('Please select a college');
        } else if (!validateEmail(email)) {
            displayError('Please enter a valid email address');
        } else if (!validatePhone(phone)) {
            displayError('Please enter a valid phone number');
        } else {
            fetch(BASE_URL + "/registrations/introreg", {
                method: "post",
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },

                body: JSON.stringify({
                    name,
                    college,
                    city,
                    email,
                    phone,
                    gender
                })
            })
                .then((res) => res.json())
                .then((response) => {
                    console.log(response);
                    if(response.status === 0) {
                        displayError('Email already exists!');
                    } else if ( response.status === 1) {
                        document.getElementById("register-form").innerHTML = "<label>Your registration is complete.</label>";
                    } else {
                        displayError('Some error occurred while connecting to server');
                    }
                });
        }
    }

    function validateEmail(email) {
        var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }

    function validatePhone(phone) {
        var re = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im;
        return re.test(String(phone));
    }

    function displayError(errorMsg) {
        if (errorMsg === '')
            document.getElementById("error").innerHTML = '';
        else
            document.getElementById("error").innerHTML = 'Error! ' + errorMsg + '!';
    }

    function setColleges() {
        fetch(BASE_URL + '/registrations/get_college')
            .then((resp) => resp.json())
            .then(function (data) {
                data.data.map(college => {
                    document.getElementById("register-college").innerHTML += `<option value=${college.id}>${college.name}</option>`;
                })
            })
            .catch(err => console.log(err))
    }
}

init();