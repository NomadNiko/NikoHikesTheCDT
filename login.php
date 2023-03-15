<?php
// Connect to the database
$dbhost = 'localhost';
$dbuser = 'root';
$dbpass = 'root';
$dbname = 'businesses';
$conn = mysqli_connect($dbhost, $dbuser, $dbpass, $dbname);

// Check if the connection was successful
if (!$conn) {
  die('Could not connect: ' . mysqli_error());
}

// Display a success message
echo 'Connected successfully<br>';

// Query the database for the contents of the businesses table
$query = "SELECT * FROM businesses";
$result = mysqli_query($conn, $query);

// Check if the query was successful
if (!$result) {
  die('Query failed: ' . mysqli_error($conn));
}

// Display the contents of the businesses table
echo '<table>';
echo '<tr><th>Business Name</th><th>Address</th><th>Phone</th></tr>';
while ($row = mysqli_fetch_assoc($result)) {
  echo '<tr>';
  echo '<td>' . $row['business_name'] . '</td>';
  echo '<td>' . $row['address'] . '</td>';
  echo '<td>' . $row['phone'] . '</td>';
  echo '</tr>';
}
echo '</table>';

// Close the database connection
mysqli_close($conn);
?>