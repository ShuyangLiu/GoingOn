-- phpMyAdmin SQL Dump
-- version 4.1.6
-- http://www.phpmyadmin.net
--
-- Host: localhost
-- Generation Time: 2015-11-20 21:05:19
-- 服务器版本： 5.6.16
-- PHP Version: 5.5.9

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
-- 表的结构 `go_activitis`
--

CREATE TABLE IF NOT EXISTS `go_activitis` (
  `activity_id` bigint(20) NOT NULL AUTO_INCREMENT,
  `activity_name` varchar(32) NOT NULL,
  `activity_group` varchar(32) NOT NULL,
  `activity_type` varchar(32) NOT NULL,
  `activity_time` varchar(32) NOT NULL,
  `activity_location` varchar(32) NOT NULL,
  `activity_description` varchar(128) NOT NULL,
  PRIMARY KEY (`activity_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- 表的结构 `go_users`
--

CREATE TABLE IF NOT EXISTS `go_users` (
  `uid` bigint(20) NOT NULL AUTO_INCREMENT,
  `username` varchar(32) NOT NULL,
  `password` varchar(32) NOT NULL,
  `email` varchar(64) NOT NULL,
  `user_group_id` int(4) NOT NULL,
  PRIMARY KEY (`uid`),
  UNIQUE KEY `email` (`email`),
  UNIQUE KEY `username` (`username`),
  UNIQUE KEY `email_2` (`email`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=1006 ;

--
-- 转存表中的数据 `go_users`
--

INSERT INTO `go_users` (`uid`, `username`, `password`, `email`, `user_group_id`) VALUES
(100, 'root', '', 'webmaster@goingon', 3),
(1000, 'GeyangYu', 'e10adc3949ba59abbe56e057f20f883e', 'gyu7@u.rochester.edu', 1),
(1001, 'zjhzxhz', '785ee107c11dfe36de668b1ae7baacbb', 'zjhzxhz@gmail.com', 1),
(1002, 'aaaaaaaa', 'e10adc3949ba59abbe56e057f20f883e', 'ygytddy@gmail.com', 1),
(1003, 'emylin', '92b9cccc0b98c3a0b8d0df25a421c0e3', 'asdf@asdf.com', 1),
(1004, 'linemy', '22d7fe8c185003c98f97e5d6ced420c7', 'hi@hi.hi', 1),
(1005, 'aaaaaaaaaaaa', 'e10adc3949ba59abbe56e057f20f883e', 'ygytddy@gmjail.com', 1);

-- --------------------------------------------------------

--
-- 表的结构 `go_user_activity`
--

CREATE TABLE IF NOT EXISTS `go_user_activity` (
  `uid` bigint(20) NOT NULL,
  `activity_id` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- 表的结构 `go_user_groups`
--

CREATE TABLE IF NOT EXISTS `go_user_groups` (
  `user_group_id` int(4) NOT NULL AUTO_INCREMENT,
  `user_group_slug` varchar(32) NOT NULL,
  `user_group_name` varchar(32) NOT NULL,
  PRIMARY KEY (`user_group_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=4 ;

--
-- 转存表中的数据 `go_user_groups`
--

INSERT INTO `go_user_groups` (`user_group_id`, `user_group_slug`, `user_group_name`) VALUES
(1, 'personal', 'Peronal'),
(2, 'organzation', 'Organzation'),
(3, 'administrator', 'Administrator');

-- --------------------------------------------------------

--
-- 表的结构 `go_user_meta`
--

CREATE TABLE IF NOT EXISTS `go_user_meta` (
  `meta_id` bigint(20) NOT NULL AUTO_INCREMENT,
  `uid` bigint(20) NOT NULL,
  `meta_key` varchar(32) NOT NULL,
  `meta_value` text NOT NULL,
  PRIMARY KEY (`meta_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=1002 ;

--
-- 转存表中的数据 `go_user_meta`
--

INSERT INTO `go_user_meta` (`meta_id`, `uid`, `meta_key`, `meta_value`) VALUES
(1000, 1000, 'Gender', 'Female'),
(1001, 1001, 'Gender', 'Male');

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
