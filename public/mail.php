<?php
// Улучшенная версия с конфигурационным файлом
header('Content-Type: application/json; charset=utf-8');
header('X-Content-Type-Options: nosniff');
header('X-Frame-Options: DENY');
header('X-XSS-Protection: 1; mode=block');
error_reporting(0);

// Проверка HTTPS (для продакшена)
if (!isset($_SERVER['HTTPS']) || $_SERVER['HTTPS'] !== 'on') {
  // Для разработки закомментируйте следующие строки
  // header('Location: https://' . $_SERVER['HTTP_HOST'] . $_SERVER['REQUEST_URI'], true, 301);
  // exit;
}

// Проверка origin (базовая защита от CSRF)
$allowed_origins = ['https://aquacademy.ru', 'https://www.aquacademy.ru', 'http://localhost'];
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
if (!empty($origin) && !in_array($origin, $allowed_origins)) {
  // Для разработки закомментируйте следующие строки
  // http_response_code(403);
  // echo json_encode(["result" => "error", "status" => "Доступ запрещен"], JSON_UNESCAPED_UNICODE);
  // exit;
}

// Подключение PHPMailer
require 'phpmailer/src/PHPMailer.php';
require 'phpmailer/src/SMTP.php';
require 'phpmailer/src/Exception.php';

// Загрузка конфигурации
$config = require_once 'config.php';

// Инициализация переменных
$body = '';
$result = "success";
$status = "Сообщение успешно отправлено";
$rfile = [];

// Проверка метода запроса
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
  echo json_encode([
    "result" => "error",
    "status" => "Метод не разрешен"
  ], JSON_UNESCAPED_UNICODE);
  exit;
}

// Проверка, есть ли файлы
$file = isset($_FILES['file']) ? $_FILES['file'] : null;

$c = true;
$title = "Новая заявка с сайта aquacademy.ru";

// Обработка POST-данных
foreach ($_POST as $key => $value) {
  $value = trim($value);
  if (!empty($value) && $key != "project_name" && $key != "admin_email" && $key != "form_subject" && $key != 'recaptcha') {
    $key = htmlspecialchars($key, ENT_QUOTES, 'UTF-8');
    $value = htmlspecialchars($value, ENT_QUOTES, 'UTF-8');
    $body .= ($c = !$c) ?
      "<tr><td style='padding: 10px; border: #e9e9e9 1px solid;'><b>$key</b></td><td style='padding: 10px; border: #e9e9e9 1px solid;'>$value</td></tr>" :
      "<tr style='background-color: #f8f8f8;'><td style='padding: 10px; border: #e9e9e9 1px solid;'><b>$key</b></td><td style='padding: 10px; border: #e9e9e9 1px solid;'>$value</td></tr>";
  }
}

// Добавляем информацию о времени и IP
$body .= "<tr style='background-color: #f0f8ff;'><td colspan='2' style='padding: 10px; border: #e9e9e9 1px solid; text-align: center; font-size: 12px; color: #666;'>";
$body .= "Время отправки: " . date('d.m.Y H:i:s') . " | IP: " . $_SERVER['REMOTE_ADDR'];
$body .= "</td></tr>";

$body = "<table style='width: 100%; border-collapse: collapse;'>$body</table>";

// Функция логирования
function logMailAttempt($data, $result, $error = null)
{
  $logData = [
    'timestamp' => date('Y-m-d H:i:s'),
    'ip' => $_SERVER['REMOTE_ADDR'],
    'user_agent' => $_SERVER['HTTP_USER_AGENT'] ?? 'Unknown',
    'data' => $data,
    'result' => $result,
    'error' => $error
  ];

  file_put_contents('mail_logs.json', json_encode($logData, JSON_UNESCAPED_UNICODE) . "\n", FILE_APPEND | LOCK_EX);
}

// Проверка reCAPTCHA
if (empty($_POST['recaptcha'])) {
  echo json_encode([
    "result" => "error",
    "status" => "Отсутствует токен reCAPTCHA"
  ], JSON_UNESCAPED_UNICODE);
  logMailAttempt($_POST, 'missing_recaptcha');
  exit;
}

$recaptcha_params = [
  'secret' => $config['recaptcha']['secret_key'],
  'response' => $_POST['recaptcha'],
  'remoteip' => $ip
];

$ch = curl_init('https://www.google.com/recaptcha/api/siteverify');
curl_setopt($ch, CURLOPT_POST, 1);
curl_setopt($ch, CURLOPT_POSTFIELDS, $recaptcha_params);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
curl_setopt($ch, CURLOPT_TIMEOUT, 10);
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
curl_setopt($ch, CURLOPT_USERAGENT, 'Mozilla/5.0 (compatible; PHP Mailer)');

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$curlError = curl_error($ch);
curl_close($ch);

$recaptcha_valid = false;
if ($curlError) {
  echo json_encode([
    "result" => "error",
    "status" => "Ошибка проверки reCAPTCHA: " . $curlError
  ], JSON_UNESCAPED_UNICODE);
  logMailAttempt($_POST, 'recaptcha_curl_error', $curlError);
  exit;
}

if ($httpCode === 200 && !empty($response)) {
  $decoded_response = json_decode($response, true);
  if (
    $decoded_response &&
    isset($decoded_response['success']) &&
    $decoded_response['success'] &&
    $decoded_response['score'] >= $config['recaptcha']['min_score']
  ) {
    $recaptcha_valid = true;
  }
}

if (!$recaptcha_valid) {
  echo json_encode([
    "result" => "error",
    "status" => "Проверка reCAPTCHA не пройдена. Попробуйте еще раз."
  ], JSON_UNESCAPED_UNICODE);
  logMailAttempt($_POST, 'recaptcha_failed', $response);
  exit;
}


// Отправка письма
$mail = new PHPMailer\PHPMailer\PHPMailer();

try {
  $mail->isSMTP();
  $mail->CharSet = 'UTF-8';
  $mail->SMTPAuth = true;

  // Настройки из конфига
  $mail->Host = $config['smtp']['host'];
  $mail->Username = $config['smtp']['username'];
  $mail->Password = $config['smtp']['password'];
  $mail->SMTPSecure = $config['smtp']['secure'];
  $mail->Port = $config['smtp']['port'];

  // Дополнительные настройки для стабильности
  $mail->SMTPOptions = [
    'ssl' => [
      'verify_peer' => false,
      'verify_peer_name' => false,
      'allow_self_signed' => true
    ]
  ];

  $mail->Timeout = 60;
  $mail->SMTPKeepAlive = true;

  $mail->setFrom($config['from']['email'], $config['from']['name']);

  // Добавляем получателей из конфига
  foreach ($config['recipients'] as $email => $name) {
    $mail->addAddress($email, $name);
  }

  // Прикрепление файлов с улучшенной проверкой
  if ($file && !empty($file['name'][0])) {
    $allowedTypes = ['jpg', 'jpeg', 'png', 'gif', 'pdf', 'doc', 'docx', 'txt'];
    $maxFileSize = 10 * 1024 * 1024; // 10MB

    for ($ct = 0; $ct < count($file['tmp_name']); $ct++) {
      if ($file['error'][$ct] === UPLOAD_ERR_OK) {
        // Проверка размера файла
        if ($file['size'][$ct] > $maxFileSize) {
          $rfile[] = "Файл {$file['name'][$ct]} слишком большой (макс. 10MB)";
          continue;
        }

        // Проверка типа файла
        $fileExtension = strtolower(pathinfo($file['name'][$ct], PATHINFO_EXTENSION));
        if (!in_array($fileExtension, $allowedTypes)) {
          $rfile[] = "Недопустимый тип файла {$file['name'][$ct]}";
          continue;
        }

        $uploadfile = tempnam(sys_get_temp_dir(), sha1($file['name'][$ct]));
        $filename = htmlspecialchars($file['name'][$ct], ENT_QUOTES, 'UTF-8');

        if (move_uploaded_file($file['tmp_name'][$ct], $uploadfile)) {
          $mail->addAttachment($uploadfile, $filename);
          $rfile[] = "Файл $filename прикреплён";
        } else {
          $rfile[] = "Ошибка при перемещении файла $filename";
          $result = "error";
        }
      } else {
        $errorMessages = [
          UPLOAD_ERR_INI_SIZE => 'Файл превышает максимальный размер',
          UPLOAD_ERR_FORM_SIZE => 'Файл превышает максимальный размер формы',
          UPLOAD_ERR_PARTIAL => 'Файл загружен частично',
          UPLOAD_ERR_NO_FILE => 'Файл не был загружен',
          UPLOAD_ERR_NO_TMP_DIR => 'Отсутствует временная папка',
          UPLOAD_ERR_CANT_WRITE => 'Ошибка записи файла на диск',
          UPLOAD_ERR_EXTENSION => 'Загрузка остановлена расширением'
        ];

        $errorMsg = $errorMessages[$file['error'][$ct]] ?? "Неизвестная ошибка";
        $rfile[] = "Ошибка загрузки файла {$file['name'][$ct]}: $errorMsg";
        $result = "error";
      }
    }
  }

  // Настройка письма
  $mail->isHTML(true);
  $mail->Subject = $title;
  $mail->Body = $body;

  // Добавляем текстовую версию
  $mail->AltBody = strip_tags($body);

  // Отправка
  if (!$mail->send()) {
    $result = "error";
    $status = "Почта не отправлена. Ошибка: " . $mail->ErrorInfo;
    logMailAttempt($_POST, 'send_failed', $mail->ErrorInfo);
  } else {
    logMailAttempt($_POST, 'success');
  }
} catch (Exception $e) {
  $result = "error";
  $status = "Сообщение не было отправлено. Причина: " . $e->getMessage();
  logMailAttempt($_POST, 'exception', $e->getMessage());
}

// Гарантированно возвращаем JSON
echo json_encode([
  "result" => $result,
  "resultfile" => $rfile,
  "status" => $status
], JSON_UNESCAPED_UNICODE);
