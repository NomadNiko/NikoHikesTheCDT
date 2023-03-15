<?php
// Start the session
session_start();


// Check if the form has been submitted
if ($_SERVER['REQUEST_METHOD'] == 'POST') {
  // Get the username and password from the form
  $username = $_POST['username'];
  $password = $_POST['password'];

  // Connect to the database
  $dbhost = 'localhost';
  $dbuser = 'root';
  $dbpass = 'root';
  $dbname = 'iexplor';
  $conn = mysqli_connect($dbhost, $dbuser, $dbpass, $dbname);

  // Check if the connection was successful
  if (!$conn) {
    die('Could not connect: ' . mysqli_error());
  }

  // Query the database for the user's username and password
  $query = "SELECT business_name, business_password FROM business WHERE business_name = '$username' AND business_password = '$password'";
  $result = mysqli_query($conn, $query);

  // Check if the query was successful
  if (!$result) {
    die('Query failed: ' . mysqli_error($conn));
  }

  // Check if the user's credentials were valid
if (mysqli_num_rows($result) == 1) {
    // Generate a new token
    $token = bin2hex(random_bytes(32));
    // Store the token in the session
    $_SESSION['token'] = $token;
    // Set a cookie with the token that expires in 30 minutes
    setcookie('token', $token, time() + 1800, '/');
    // Redirect the user to the protected page
    header('Location: protected_page.php');
    exit;
}

    // Redirect the user to the protected page
    header("Location: login_test.html");
    exit;
  } else {
    // Display an error message
    echo 'Invalid username or password.';
  }

  // Close the database connection
  mysqli_close($conn);
}
?>
<!DOCTYPE html>
<html>
  <head>
    <title>Login</title>
  </head>
  <body>
    <h1>Login</h1>
    <form action="<?php echo htmlspecialchars($_SERVER['PHP_SELF']); ?>" method="post">
      <label for="username">Username:</label>
      <input type="text" id="username" name="username"><br>
      <label for="password">Password:</label>
      <input type="password" id="password" name="password"><br>
      <input type="submit" value="Log In">
    </form>
  </body>
</html>
