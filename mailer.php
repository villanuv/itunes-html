<?php
if($_POST) {
  $to = "villanuv@yahoo.com"; // your mail here
  $subject = "From Not iTunes";
  $name = filter_var($_POST["name"], FILTER_SANITIZE_STRING);
  $email = filter_var($_POST["email"], FILTER_SANITIZE_EMAIL);
  $message = filter_var($_POST["message"], FILTER_SANITIZE_STRING);
  $body = "From: $name\nE-mail: $email\n\nMessage:\n$message\n";
  
  if(@mail($to, $subject, $body)) {
    $output = json_encode(array('success' => true));
    die($output);
  } else {
    $output = json_encode(array('success' => false));
    die($output);
  }
}