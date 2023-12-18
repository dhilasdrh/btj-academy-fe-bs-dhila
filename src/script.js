$(document).ready(function () {
    /* ------- ROTATE LOGO 360 DEGREE ------ */
    let degree = 0;
    $('#logoImg').on('click', function() {
        degree += 360;
        $(this).css({'transform': `rotate(${degree}deg)`, 'transition-duration': '1s'});
    });

    /* ---------------- LOGIN INPUT VALIDATION -------------- */
    var usernameInput = $('#usernameInput');
    var passwordInput = $('#passwordInput');

    var usernameError = $('#invalidUsername');
    var passwordError = $('#invalidPassword');

    let username = "";
    let password = "";

    usernameInput.on('input', validateUsername);
    passwordInput.on('input', validatePassword);

    /* ---------------- SHOW PASSWORD CHECKBOX ------------------ */
    $('#showPassword').on('change', function() {
        passwordInput.attr('type', this.checked ? 'text' : 'password');
    });

    /* ----------------- CAPS LOCK WARNING ---------------- */
    $('#usernameInput, #passwordInput').on('keyup keydown', function(e) {
        const capsLockOn = e.originalEvent.getModifierState("CapsLock");
        // add or remove 'd-none' class on #capslockWarning based on caps lock activation
        $('#capslockWarning').toggleClass('d-none', !capsLockOn)
    });

    /* ----------------- LOGIN VALIDATION ---------------- */ 
    function authLogin() {
        validateUsername();
        validatePassword();
    
        if (username !== "" && password !== "" && passwordError.css('display') === 'none') {
            authenticateUser();
        }
    }
    
    $("#loginForm").submit(function(e) {
        e.preventDefault();
        authLogin();
    });
    
    $("#aboutLink").click(function(e) {
        e.preventDefault();
        authLogin();
    });

    function validateUsername() {
        username = $.trim(usernameInput.val());
        var usernameEmpty = username == ""; 
        usernameInput.toggleClass('is-invalid', usernameEmpty);
    }

    function validatePassword() {
        password = $.trim(passwordInput.val());
        const isValid = isPasswordValid(password);
        var passwordEmpty = password == "";

        passwordError.text(passwordEmpty ? "Please fill in the password correctly" : (!isValid && passwordError.text()));
        passwordInput.toggleClass('is-invalid', !isValid || passwordEmpty);
    }
    
    function isPasswordValid(password) {
        var conditions = [
            { regex: /[A-Z]/, message: 'one uppercase letter' },
            { regex: /[a-z]/, message: 'one lowercase letter' },
            { regex: /\d/, message: 'one number' }
            // { regex: /[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]/, message: 'one symbol' }
        ];

        var unmetConditions = conditions.filter(function(condition) {
            return !condition.regex.test(password);
        });

        if (unmetConditions.length > 0) {
            var errorMessage = "Password need to have " + unmetConditions.map(function(cond) {
                return cond.message;
            }).join(', ').replace(/,([^,]*)$/, unmetConditions.length > 2 ? ', and$1' : ' and$1') + '.';

            passwordError.text(errorMessage);
            return false;
        } else {
            return true;
        }
    }

    // fetch data from API and authenticate user 
    const authenticateUser = async () => {
        const url = 'https://dummyjson.com/users';
        try {
            const response = await fetch(url);
            if (response.ok) {
                const data = await response.json();
                const isValidUser = data.users.some(user => user.username === username && user.password === password);
        
                if (isValidUser) {
                    // Authentication success
                    const user = data.users.find(user => user.username === username && user.password === password);
                    const fullName = `${user.firstName} ${user.lastName}`;
                    alert(`Login Successful! Welcome ${fullName}`);
                    window.location.href = 'about.html';
                    // $('#successLoginMessage').removeClass('d-none');

                } else {
                    // Authentication failed
                    $('#failedLoginMessage').removeClass('d-none');
                    $('#usernameInput, #passwordInput').addClass('is-invalid');
                    const passwordEmpty = password === "";
                    if (passwordEmpty) {
                        passwordError.text("Please fill in the password correctly");
                        passwordError.addClass('d-block');
                    }
                }
            } else {
                throw new Error('Failed to fetch data');
            } 
        } catch (error) {
            console.error('Error fetching data:', error);
            alert('An error occurred during login. Please try again later.');
        }
    };

    /* -------- jQuery Effects -------- */
    
    $("#promptLogin").hide(); // initially hide prompt login 
    $("#promptLogin").slideDown(700); // display prompt login by sliding it down
    

    // $("#name").slideDown();

    $('#imgLogin').animate({
        scale: 1
    }, 1000)


    // animated letter spacing for logo title (Welcome)
    $("#logoTitle").on('click', function(){
        if ($(this).hasClass('animated')) {
            // If the element has the 'animated' class, remove it and animate back to the original state
            $(this).animate({
                marginLeft: '0',
                letterSpacing: '0'
            }, 1000).removeClass('animated');
        } else {
            // If the element doesn't have the 'animated' class, add it and animate
            $(this).animate({
                marginLeft: '10px',
                letterSpacing: '2px'
            }, 1000).addClass('animated');
        }}); 


    // typing and fade-in fade-out effect for name
    var name = $("#name").text();
    var speed = 200; // 1s

    function typeWriter(text, i) {
        $("#name").text(text.substring(0, i + 1));
        
        if (i === text.length) {
            pointer.fadeToggle(speed, () => typeWriter(text, i));
        } else {
            $("#name").fadeIn(speed, () => setTimeout(() => typeWriter(text, i + 1), speed));
        }
    }
    setTimeout(() => typeWriter(name, 0), 100);



    /* ------ TOGGLE DARK/LIGHT MODE TOGGLE ------- */
    
    // // load theme mode state from localStorage
    // const darkModeToggle = $('#darkModeSwitch');
    // const rootElement = $(':root');
    // const initialDarkModeState = localStorage.getItem('darkMode') === 'false';
    // darkModeToggle.prop('checked', initialDarkModeState);
    // rootElement.attr('data-theme', initialDarkModeState ? 'dark' : 'light');

    // darkModeToggle.on('change', function () {
    //     const isDarkMode = darkModeToggle.is(':checked');
    //     $('#main-container').toggleClass('bg-dark', isDarkMode);
    //     rootElement.attr('data-theme', isDarkMode ? 'dark' : '');
    //     saveDarkModeState(isDarkMode);
    // });

    // function saveDarkModeState(isDarkMode) {
    //     localStorage.setItem('darkMode', isDarkMode);
    // }

    
   /* ------ ANIMATED SECTION & SCROLL UP/DOWN BUTTONS ------ */
    var observer = new IntersectionObserver(handleIntersection, { threshold: 0.2 });

    $(".animated-section").each(function () {
        observer.observe(this);
    });

    // Initial state: hide scroll-up and scroll-down buttons
    $(".scroll-top, .scroll-bottom").hide();

    function handleIntersection(entries, observer) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                switch (entry.target.id) {
                    case "section-profile":
                        $(entry.target).animate({ opacity: 1 }, 500);
                        $(".scroll-bottom").show();
                        $(".scroll-top").hide();
                        break;
                    case "section-education":
                        // fade in and slide in from left
                        $(entry.target).animate({ opacity: 1, left: 0 }, 1000);
                        break;
                    case "section-work":
                        // fade in and scale up
                        $(entry.target).animate({ opacity: 1, scale: 1 }, 1000);
                        break;
                    case "section-motto":
                        // fade in and slide in from left
                        $(entry.target).animate({ opacity: 1, right: 0 }, 1000, function () {
                            // show the scroll-top button when the "section-motto" is reached
                            $(".scroll-top").fadeIn(200);
                            $(".scroll-bottom").hide();
                        });
                        break;
                }
                observer.unobserve(entry.target);
            }
        });
    }

    // scroll to the top when the scroll-top button is clicked
    $(".scroll-top").on("click", function () {
        $("#main-container").animate({ scrollTop: 0 }, 500);
        $(".scroll-top").hide(); // hide the button again after reaching the top
        $(".scroll-bottom").show();
    });

    // scroll to the bottom when the scroll-bottom button is clicked
    $(".scroll-bottom").on("click", function () {
        $("#main-container").animate({ scrollTop: $(document).height() }, "slow");
        $(".scroll-bottom").hide(); // hide the button again after reaching the bottom
        $(".scroll-top").fadeIn(200);
    });


    
    // show profile img
    $("#profileImg").hide();
    $("#profileImg").show(500);

    // floating image on login page
    function floatImage() {
        $("#imgLogin")
        .animate({ top: '+=20px' }, 1000, 'swing')
        .animate({ top: '-=20px' }, 1000, 'swing', floatImage);
    }
  
    floatImage(); // Start the animation
});