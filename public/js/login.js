const loginForm = document.querySelector('.form--login');

async function login(email, password) {
  try {
    const res = await axios.post(
      'http://127.0.0.1:3000/api/v1/users/login',
      {
        email,
        password
      }
    );

    console.log(res.data);
  } catch (err) {
    console.error(err);
  }
}

if (loginForm) {
  loginForm.addEventListener('submit', e => {
    e.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    login(email, password);
  });
}