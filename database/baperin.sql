-- phpMyAdmin SQL Dump
-- version 5.0.4
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Nov 25, 2021 at 01:32 AM
-- Server version: 10.4.16-MariaDB
-- PHP Version: 7.4.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `baperin`
--

-- --------------------------------------------------------

--
-- Table structure for table `jadwal_konseling`
--

CREATE TABLE `jadwal_konseling` (
  `id_konseling` int(11) NOT NULL,
  `tanggal` varchar(50) DEFAULT NULL,
  `username` varchar(50) NOT NULL,
  `nama_psikolog` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `jadwal_mentoring`
--

CREATE TABLE `jadwal_mentoring` (
  `id_mentoring` int(11) NOT NULL,
  `tanggal` varchar(50) DEFAULT NULL,
  `username` varchar(50) NOT NULL,
  `nama_psikolog` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `psikolog`
--

CREATE TABLE `psikolog` (
  `nama_psikolog` varchar(50) NOT NULL,
  `usia` int(3) NOT NULL,
  `gender` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `psikolog`
--

INSERT INTO `psikolog` (`nama_psikolog`, `usia`, `gender`) VALUES
('Brad Blunder Roam', 42, 'Laki - Laki'),
('Ucup Van Hellsing', 29, 'Laki - Laki'),
('Valentino Subagjo', 53, 'Laki - Laki');

-- --------------------------------------------------------

--
-- Table structure for table `user`
--

CREATE TABLE `user` (
  `username` varchar(50) NOT NULL,
  `email` varchar(50) NOT NULL,
  `password` varchar(150) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `user`
--

INSERT INTO `user` (`username`, `email`, `password`) VALUES
('adhi', 'adhi@gmail.com', '$2b$10$bakJmslfxHlxdHEv1DQ1/uPlPD45.GXRhnHTPVJPYkjW2DpGrz6Bm'),
('adhi buchori', 'adhi.buchori@gmail.com', '$2b$10$ZIEvsGrj63fr/S74ZRU1q.E2XRxdiKGhMHRxSMQZgT1AHFQOlKSx.'),
('admin', 'admin@gmail.com', '$2b$10$ff5qoNNOb1hdKXhrifYbCe2Y1zVIeAp7O3FUWQC0XzZlRtI7.L1xm'),
('alif', 'alif@mahasiswa.com', '$2b$10$9TP521mtQv/lXUT652VwKuy19.0JOaFxjYx1sL/QO4Wqf9vyKkDZy'),
('bagus', 'bagussajiwoutomo12@gmail.com', '$2b$10$Jn9Ydq4ZZB4eIF7IQgJDluYErrpf10EQ4zvU1r4D6pw1FUu5HBhZm'),
('bambang', 'bambang@gmail.com', '$2b$10$8YWMgDU2YJDOICxEYXq3QO9tkxdU5DIzsE8GSO5m7l.gbjr1WptVS');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `jadwal_konseling`
--
ALTER TABLE `jadwal_konseling`
  ADD PRIMARY KEY (`id_konseling`),
  ADD KEY `username` (`username`),
  ADD KEY `nama_psikolog` (`nama_psikolog`);

--
-- Indexes for table `jadwal_mentoring`
--
ALTER TABLE `jadwal_mentoring`
  ADD PRIMARY KEY (`id_mentoring`),
  ADD KEY `username` (`username`),
  ADD KEY `nama_psikolog` (`nama_psikolog`);

--
-- Indexes for table `psikolog`
--
ALTER TABLE `psikolog`
  ADD PRIMARY KEY (`nama_psikolog`);

--
-- Indexes for table `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`username`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `jadwal_konseling`
--
ALTER TABLE `jadwal_konseling`
  MODIFY `id_konseling` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT for table `jadwal_mentoring`
--
ALTER TABLE `jadwal_mentoring`
  MODIFY `id_mentoring` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `jadwal_konseling`
--
ALTER TABLE `jadwal_konseling`
  ADD CONSTRAINT `jadwal_konseling_ibfk_1` FOREIGN KEY (`username`) REFERENCES `user` (`username`),
  ADD CONSTRAINT `jadwal_konseling_ibfk_2` FOREIGN KEY (`nama_psikolog`) REFERENCES `psikolog` (`nama_psikolog`);

--
-- Constraints for table `jadwal_mentoring`
--
ALTER TABLE `jadwal_mentoring`
  ADD CONSTRAINT `jadwal_mentoring_ibfk_1` FOREIGN KEY (`username`) REFERENCES `user` (`username`),
  ADD CONSTRAINT `jadwal_mentoring_ibfk_2` FOREIGN KEY (`nama_psikolog`) REFERENCES `psikolog` (`nama_psikolog`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
