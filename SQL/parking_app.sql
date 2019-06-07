-- phpMyAdmin SQL Dump
-- version 4.5.4.1deb2ubuntu2.1
-- http://www.phpmyadmin.net
--
-- Host: localhost
-- Generation Time: Jun 06, 2019 at 11:59 AM
-- Server version: 5.7.26-0ubuntu0.16.04.1
-- PHP Version: 7.0.33-0ubuntu0.16.04.5

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `parking_app`
--

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `user_name` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `user_email` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `user_image` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `facebook_id` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `google_id` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `user_password` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `user_mobile_country_code` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `user_mobile` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `user_login_type` enum('N','F','G') COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '''N'' stands for native and ''F'' for facebook and ''G'' is for google',
  `user_delete_status` enum('1','0') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '0',
  `user_otp` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `user_otp_verified` enum('0','1') COLLATE utf8mb4_unicode_ci DEFAULT '0',
  `user_access_token` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `remember_token` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `update_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `user_name`, `user_email`, `user_image`, `facebook_id`, `google_id`, `user_password`, `user_mobile_country_code`, `user_mobile`, `user_login_type`, `user_delete_status`, `user_otp`, `user_otp_verified`, `user_access_token`, `remember_token`, `created_at`, `update_at`) VALUES
(1, 'karan', 'karan@gmail.com', NULL, NULL, NULL, '$2b$10$UxsE.Dd5vCRXbbNCQG.aTeWX5zkTO2OX3uTKxQzW2UdmmJEoyGBhm', '+91', '9888077993', 'N', '0', '2211', '0', 'ed70a26a65d720f5686bdadb4de6458c3b2ed785c69eed149b90a2ad7bde9daa', NULL, '2019-05-22 20:19:12', '2019-05-23 05:44:22'),
(2, 'Karan', '95sharma.karan@gmail.com', NULL, NULL, NULL, '$2b$10$QFLpiZEnp01vefpERRHjT.egJgC88AfDpS8ek9Dm42NaMd/nTK7M2', '+91', '9888077992', 'N', '0', '6429', '0', '0324cfff7f08ff9530b5acdde60cb567522088b5f13fb8c0c55dee21d23afa65', NULL, '2019-05-23 05:00:38', '2019-05-23 05:00:38'),
(3, 'Karan', '95shaaage@gmail.com', NULL, NULL, NULL, '$2b$10$E/Q1eG1Z6ZjmP5oyjT5uxeXsrFsEaSYOEXJeQ4gZ7icCnOFFTnh9.', '+91', '9888077994', 'N', '0', '5846', '0', '854ecc66bf06d416c42c66bd05b58117580fa261a263709dd1ba9217db0549c2', NULL, '2019-05-23 05:02:17', '2019-05-23 05:02:17'),
(4, 'Karan', 'DAD@GMAIL.COM', NULL, NULL, NULL, '$2b$10$mmo3WgTyQVEHBy/C7660KOEA0T.CEUhHDcLsslQ8uuBwBRGG0d1cm', '+91', '9888077991', 'N', '0', '7778', '0', '640c01452faae47a2bc71580b02b073c5e26cde2ddf86380f7fa4d42aef3d3f6', NULL, '2019-05-23 05:17:10', '2019-05-23 05:17:10'),
(5, 'Karan', '98asd@gmail.com', NULL, NULL, NULL, '$2b$10$zgeS4RmXsvnlBFZ8HqJpre.2QottnBee1q.pTTXUJQV79/pIhXhz2', '+91', '9823937292', 'N', '0', '3616', '0', '4fb9cc2cbc517d5ac4e63e98a3f0ed69d218cdbc49785a0e95c9d627e18f678a', NULL, '2019-05-23 05:20:13', '2019-05-23 05:20:13'),
(6, 'Karan', 'kad@gmail.com', NULL, NULL, NULL, '$2b$10$Yv16H2GuW8FfSRje2Xg2wOKXKaloNMtDF.e6bB3y5VCtxxuOrFfKK', '+91', '9812800119', 'N', '0', '1712', '0', '2d43d6ef8ef1140cbf03840cd0a2e13d3dd4f6956bad62fc3e3af73c7a442b5c', NULL, '2019-05-23 05:40:58', '2019-05-23 05:40:58');

-- --------------------------------------------------------

--
-- Table structure for table `users_info`
--

CREATE TABLE `users_info` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `user_current_location` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `user_lat` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_long` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_device_type` enum('A','I') COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '''A'' is for android and ''I'' is for iOS devices',
  `user_device_token` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `users_info`
--

INSERT INTO `users_info` (`id`, `user_id`, `user_current_location`, `user_lat`, `user_long`, `user_device_type`, `user_device_token`, `created_at`, `updated_at`) VALUES
(1, 1, NULL, '36.478787848877', '72.45415215285', 'I', '5e170b87131efb02d', '2019-04-11 13:53:11', '2019-04-12 07:26:06'),
(2, 2, NULL, '36.478787848877', '72.45415215285', 'A', '5e170b87131efb02d', '2019-04-12 07:27:18', '2019-04-12 07:28:05'),
(3, 9, NULL, '30.46454656', '76.34216464', 'I', 'qwerty', '2019-04-12 11:30:14', '2019-04-15 12:18:50'),
(4, 13, NULL, '36.478787848877', '72.45415215285', 'I', '5e170b87131efb02dgfgf5', '2019-04-16 13:42:46', '2019-04-16 13:42:46');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `users_info`
--
ALTER TABLE `users_info`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;
--
-- AUTO_INCREMENT for table `users_info`
--
ALTER TABLE `users_info`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
