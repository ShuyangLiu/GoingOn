-- phpMyAdmin SQL Dump
-- version 4.4.3
-- http://www.phpmyadmin.net
--
-- Host: localhost
-- Generation Time: Nov 07, 2015 at 06:24 上午
-- Server version: 5.6.24
-- PHP Version: 5.6.8

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Database: `goingon`
--

-- --------------------------------------------------------

--
-- Table structure for table `go_users`
--

CREATE TABLE IF NOT EXISTS `go_users` (
  `uid` bigint(20) NOT NULL,
  `username` varchar(32) NOT NULL,
  `password` varchar(32) NOT NULL,
  `email` varchar(64) NOT NULL,
  `user_group_id` int(4) NOT NULL
) ENGINE=InnoDB AUTO_INCREMENT=1002 DEFAULT CHARSET=utf8;

--
-- Dumping data for table `go_users`
--

INSERT INTO `go_users` (`uid`, `username`, `password`, `email`, `user_group_id`) VALUES
(100, 'root', '', 'webmaster@goingon', 3),
(1000, 'GeyangYu', 'e10adc3949ba59abbe56e057f20f883e', 'gyu7@u.rochester.edu', 1),
(1001, 'zjhzxhz', '785ee107c11dfe36de668b1ae7baacbb', 'zjhzxhz@gmail.com', 1);

-- --------------------------------------------------------

--
-- Table structure for table `go_user_groups`
--

CREATE TABLE IF NOT EXISTS `go_user_groups` (
  `user_group_id` int(4) NOT NULL,
  `user_group_slug` varchar(32) NOT NULL,
  `user_group_name` varchar(32) NOT NULL
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8;

--
-- Dumping data for table `go_user_groups`
--

INSERT INTO `go_user_groups` (`user_group_id`, `user_group_slug`, `user_group_name`) VALUES
(1, 'personal', 'Peronal'),
(2, 'organzation', 'Organzation'),
(3, 'administrator', 'Administrator');

-- --------------------------------------------------------

--
-- Table structure for table `go_user_meta`
--

CREATE TABLE IF NOT EXISTS `go_user_meta` (
  `meta_id` bigint(20) NOT NULL,
  `uid` bigint(20) NOT NULL,
  `meta_key` varchar(32) NOT NULL,
  `meta_value` text NOT NULL
) ENGINE=InnoDB AUTO_INCREMENT=1002 DEFAULT CHARSET=utf8;

--
-- Dumping data for table `go_user_meta`
--

INSERT INTO `go_user_meta` (`meta_id`, `uid`, `meta_key`, `meta_value`) VALUES
(1000, 1000, 'Gender', 'Female'),
(1001, 1001, 'Gender', 'Male');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `go_users`
--
ALTER TABLE `go_users`
  ADD PRIMARY KEY (`uid`),
  ADD UNIQUE KEY `email` (`email`),
  ADD UNIQUE KEY `username` (`username`),
  ADD UNIQUE KEY `email_2` (`email`);

--
-- Indexes for table `go_user_groups`
--
ALTER TABLE `go_user_groups`
  ADD PRIMARY KEY (`user_group_id`);

--
-- Indexes for table `go_user_meta`
--
ALTER TABLE `go_user_meta`
  ADD PRIMARY KEY (`meta_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `go_users`
--
ALTER TABLE `go_users`
  MODIFY `uid` bigint(20) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=1002;
--
-- AUTO_INCREMENT for table `go_user_groups`
--
ALTER TABLE `go_user_groups`
  MODIFY `user_group_id` int(4) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=4;
--
-- AUTO_INCREMENT for table `go_user_meta`
--
ALTER TABLE `go_user_meta`
  MODIFY `meta_id` bigint(20) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=1002;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
