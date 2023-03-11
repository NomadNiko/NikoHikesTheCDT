document.addEventListener('DOMContentLoaded', function() {
	const signupForm = document.getElementById('signup-form');
	signupForm.addEventListener('submit', signup);
});

function signup(event) {
	event.preventDefault();
	const businessname = document.getElementById('signup-businessname').value;
	const password = document.getElementById('signup-password').value;
	const address = document.getElementById('signup-address').value;
	const description = document.getElementById('signup-description').value;
	const xhr = new XMLHttpRequest();
	xhr.open('POST', 'https://site.nomadniko.com/signup');
	xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
	xhr.onload = function() {
		if (xhr.status === 200) {
			alert('Account created successfully!');
			document.location.reload();
		} else {
			alert('Error: ' + xhr.statusText);
		}
	};
	xhr.send('businessname=' + encodeURIComponent(businessname) + '&password=' + encodeURIComponent(password) + '&address=' + encodeURIComponent(address) + '&description=' + encodeURIComponent(description));
}

window.addEventListener('DOMContentLoaded', () => {
    let scrollPos = 0;
    const mainNav = document.getElementById('mainNav');
    const headerHeight = mainNav.clientHeight;
    window.addEventListener('scroll', function() {
        const currentTop = document.body.getBoundingClientRect().top * -1;
        if ( currentTop < scrollPos) {
            // Scrolling Up
            if (currentTop > 0 && mainNav.classList.contains('is-fixed')) {
                mainNav.classList.add('is-visible');
            } else {
                console.log(123);
                mainNav.classList.remove('is-visible', 'is-fixed');
            }
        } else {
            // Scrolling Down
            mainNav.classList.remove(['is-visible']);
            if (currentTop > headerHeight && !mainNav.classList.contains('is-fixed')) {
                mainNav.classList.add('is-fixed');
            }
        }
        scrollPos = currentTop;
    });
})
