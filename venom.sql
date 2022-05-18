-- phpMyAdmin SQL Dump
-- version 5.1.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Tempo de geração: 06-Maio-2022 às 22:18
-- Versão do servidor: 10.4.22-MariaDB
-- versão do PHP: 7.4.27

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Banco de dados: `venom`
--
CREATE DATABASE IF NOT EXISTS `venom` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE `venom`;

-- --------------------------------------------------------

--
-- Estrutura da tabela `cursos`
--

CREATE TABLE `cursos` (
  `id` int(11) NOT NULL,
  `abrev` varchar(3) NOT NULL,
  `nome` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Extraindo dados da tabela `cursos`
--

INSERT INTO `cursos` (`id`, `abrev`, `nome`) VALUES
	(DEFAULT, 'adm', 'Administração'),
	(DEFAULT, 'ec', 'Engenharia da Computação'),
	(DEFAULT, 'fis', 'Física'),
	(DEFAULT, 'tce', 'Construção de Edifícios');

--
-- Estrutura da tabela `disc_adm`
--

CREATE TABLE `disc_adm` (
  `id` int(11) NOT NULL,
  `nome` varchar(50) NOT NULL,
  `periodo` tinyint(3) UNSIGNED NOT NULL,
  `carga` int(10) UNSIGNED NOT NULL,
  `ativa` tinyint(1) NOT NULL DEFAULT 0,
  `parap` int(10) UNSIGNED NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Extraindo dados da tabela `disc_adm`
--

INSERT INTO `disc_adm` (`id`, `nome`, `periodo`, `carga`, `ativa`, `parap`) VALUES
(1, 'Introdução a Administração', 1, 60, 1, 1),
(2, 'Filosofia e Ética', 1, 60, 1, 1),
(3, 'Psicologia Aplicada a Administração', 1, 60, 1, 1),
(4, 'Fundamentos da Matemática', 1, 60, 1, 1),
(5, 'Português Instrumental', 1, 60, 1, 1),
(6, 'Inglês Instrumental', 1, 45, 1, 1),
(7, 'Informática Básica', 1, 30, 1, 1),
(8, 'Teoria Geral da Administração', 2, 60, 1, 2),
(9, 'Metodologia da Pesquisa Científica', 2, 45, 0, 0),
(10, 'Sociologia Aplicada a Administração', 2, 45, 0, 0),
(11, 'Introdução a Economia', 2, 60, 0, 0),
(12, 'Instituição de Direito Público e Privado', 2, 60, 0, 0),
(13, 'Matemática Aplicada a Administração I', 2, 60, 0, 0),
(14, 'Estatística e Probabilidade', 2, 45, 0, 0),
(15, 'Micro e Macro Economia', 3, 75, 1, 3),
(16, 'Contabilidade Aplicada a Administração', 3, 60, 1, 3),
(17, 'Matemática Aplicada a Administração II', 3, 60, 1, 3),
(18, 'Gestão de Pessoas', 3, 60, 1, 3),
(19, 'Administração de Marketing I', 3, 45, 1, 3),
(20, 'Estatística Aplicada a Administração', 3, 60, 1, 3),
(21, 'Projeto Interdisciplinar I', 3, 15, 1, 3),
(22, 'Matemática Financeira', 4, 60, 0, 0),
(23, 'Direito Administrativo e Tributário', 4, 60, 0, 0),
(24, 'Administração de Sistemas de Informação', 4, 60, 0, 0),
(25, 'Contabilidade de Custos', 4, 60, 0, 0),
(26, 'Administração de Marketing II', 4, 60, 0, 0),
(27, 'Economia Brasileira Contemporânea', 4, 60, 0, 0),
(28, 'Projeto Interdisciplinar II', 4, 15, 0, 0),
(29, 'Administração da Produção I', 5, 60, 1, 5),
(30, 'Organização de Sistemas e Métodos', 5, 60, 1, 5),
(31, 'Administração Financeira Orçamentária', 5, 60, 1, 5),
(32, 'Finanças Públicas', 5, 60, 1, 5),
(33, 'Direito Empresarial e Trabalhista', 5, 60, 1, 5),
(34, 'Pesquisa Operacional em Administração', 5, 60, 1, 5),
(35, 'Projeto Interdisciplinar III', 5, 15, 1, 5),
(36, 'Administração da Produção II', 6, 60, 0, 0),
(37, 'Psicologia do Consumidor', 6, 45, 0, 0),
(38, 'Teoria da Decisão', 6, 60, 0, 0),
(39, 'Administração de Serviços', 6, 45, 0, 0),
(40, 'Empreendedorismo e Desenvolvimento Gerencial', 6, 45, 0, 0),
(41, 'Administração de Recursos Materiais', 6, 60, 0, 0),
(42, 'Gestão Pública', 6, 45, 0, 0),
(43, 'Projeto Interdisciplinar IV', 6, 15, 0, 0),
(44, 'Gestão de Qualidade', 7, 60, 1, 7),
(45, 'Gestão Ambiental', 7, 60, 1, 7),
(46, 'Pesquisa de Mercado', 7, 45, 1, 7),
(47, 'Logística', 7, 60, 1, 7),
(48, 'Gestão de Renumeração e Avaliação de Resultado', 7, 60, 1, 7),
(49, 'Planejamento Estratégico', 7, 60, 1, 7),
(50, 'Projeto Interdisciplinar V', 7, 15, 1, 7),
(51, 'Ética Profissional', 8, 45, 0, 0),
(52, 'Elaboração e Gerenciamento de Projetos', 8, 60, 1, 8),
(53, 'Logística Internacional', 8, 60, 0, 0),
(54, 'Comércio Exterior', 8, 60, 0, 0),
(55, 'TCC I', 8, 45, 0, 0),
(56, 'Estágio Supervisionado I', 8, 180, 0, 0),
(57, 'TCC II', 9, 45, 0, 0),
(58, 'Estágio Supervisionado II', 9, 180, 0, 0);

-- --------------------------------------------------------

--
-- Estrutura da tabela `disc_ec`
--

CREATE TABLE `disc_ec` (
  `id` int(11) NOT NULL,
  `nome` varchar(50) NOT NULL,
  `periodo` tinyint(3) UNSIGNED NOT NULL,
  `carga` int(10) UNSIGNED NOT NULL,
  `ativa` tinyint(1) NOT NULL DEFAULT 0,
  `parap` int(10) UNSIGNED NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Extraindo dados da tabela `disc_ec`
--

INSERT INTO `disc_ec` (`id`, `nome`, `periodo`, `carga`, `ativa`, `parap`) VALUES
(1, 'Introdução a Engenharia da Computação', 1, 60, 1, 1),
(2, 'Metodologia de Pesquisa Científica', 1, 60, 1, 1),
(3, 'Circuitos Lógicos I', 1, 60, 1, 1),
(4, 'Cálculo Vetorial e Geometria Analítica', 1, 60, 1, 1),
(5, 'Cálculo Diferencial e Integral I ', 1, 90, 1, 1),
(6, 'Introdução a Programação', 1, 60, 1, 1),
(7, 'Laboratório de Introdução a Programação', 1, 45, 1, 1),
(8, 'Eletricidade e Circuitos para Computação I', 2, 60, 1, 3),
(9, 'Circuitos Lógicos II ', 2, 60, 0, 0),
(10, 'Calculo Diferencial e Integral II', 2, 75, 0, 0),
(11, 'Física Geral I', 2, 75, 0, 0),
(12, 'Laboratório de Física I', 2, 30, 0, 0),
(13, 'Álgebra Linear', 2, 60, 0, 0),
(14, 'Linguagem de Programação I ', 2, 60, 0, 0),
(15, 'Laboratório de Linguagem de Programação I', 2, 30, 0, 0),
(16, 'Química Geral e Inorgânica', 2, 60, 0, 0),
(17, 'Eletricidade e Circuitos para Computação II', 3, 60, 1, 3),
(18, 'Materiais para Micro e Nano Tecnologia', 3, 60, 1, 3),
(19, 'Estrutura de Dados', 3, 60, 1, 3),
(20, 'Equações Diferencias e Ordinárias', 3, 60, 1, 3),
(21, 'Cálculo Diferencial e Integral III', 3, 75, 1, 3),
(22, 'Física Geral II ', 3, 75, 1, 3),
(23, 'Laboratório de Física II ', 3, 30, 1, 3),
(24, 'Banco de Dados I ', 4, 60, 0, 0),
(25, 'Eletrônica Aplicada I', 4, 60, 0, 0),
(26, 'Arquitetura de Computadores', 4, 60, 0, 0),
(27, 'Física Geral III ', 4, 60, 0, 0),
(28, 'Laboratório de Física III ', 4, 30, 0, 0),
(29, 'Linguagem de Programação II ', 4, 60, 0, 0),
(30, 'Estatística e Probabilidade I', 4, 60, 0, 0),
(31, 'Cálculo Numérico', 5, 60, 1, 5),
(32, 'Análise e Projeto de Algoritmo', 5, 60, 1, 5),
(33, 'Eletrônica Aplicada II ', 5, 60, 1, 5),
(34, 'Introdução à Microeletrônica', 5, 60, 1, 5),
(35, 'Rede de Computadores', 5, 60, 1, 5),
(36, 'Sistemas Operacionais I ', 5, 60, 1, 5),
(37, 'Introdução a Mecânica dos Fluidos', 5, 45, 1, 5),
(38, 'Concepção Estruturada de Circuitos Integrados', 6, 60, 0, 0),
(39, 'Micro controladores', 6, 60, 0, 0),
(40, 'Sistemas Embarcados I ', 6, 60, 1, 6),
(41, 'Sinais e Sistemas Dinâmicos ', 6, 60, 1, 6),
(42, 'Introdução a Computação Gráfica', 6, 60, 0, 0),
(43, 'Pesquisa Operacional', 6, 60, 0, 0),
(44, 'Sistemas de Controle e Automação', 7, 60, 1, 7),
(45, 'Avaliação e Desempenho de Sistemas Computacionais', 7, 60, 1, 7),
(46, 'Redes sem Fio', 7, 60, 1, 7),
(47, 'Processamento Digital de Imagens', 7, 60, 1, 7),
(48, 'Complementar Optativa I ', 7, 60, 1, 7),
(49, 'Complementar Optativa II', 7, 60, 1, 7),
(50, 'Engenharia de Software ', 8, 60, 0, 0),
(51, 'Inteligência Artificial I', 8, 60, 0, 0),
(52, 'Robótica', 8, 60, 0, 0),
(53, 'Teoria da Informação', 8, 60, 0, 0),
(54, 'Administração para Engenharia', 8, 60, 0, 0),
(55, 'Complementar Optativa III', 8, 60, 0, 0),
(56, 'Trabalho de Conclusão de Curso I', 9, 30, 0, 0),
(57, 'Computador e Sociedade ', 9, 60, 0, 0),
(58, 'Economia I ', 9, 60, 0, 0),
(59, 'Complementar Optativa IV', 9, 60, 0, 0),
(60, 'Testes de Software ', 9, 60, 0, 0),
(61, 'Projeto de Inovação Tecnológica', 9, 60, 0, 0),
(62, 'Trabalho de Conclusão de Curso II', 10, 30, 0, 0),
(63, 'Estagio Supervisionado', 10, 300, 0, 0);

-- --------------------------------------------------------

--
-- Estrutura da tabela `disc_fis`
--

CREATE TABLE `disc_fis` (
  `id` int(11) NOT NULL,
  `nome` varchar(50) NOT NULL,
  `periodo` tinyint(3) UNSIGNED NOT NULL,
  `carga` int(10) UNSIGNED NOT NULL,
  `ativa` tinyint(1) NOT NULL DEFAULT 0,
  `parap` int(10) UNSIGNED NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Extraindo dados da tabela `disc_fis`
--

INSERT INTO `disc_fis` (`id`, `nome`, `periodo`, `carga`, `ativa`, `parap`) VALUES
(1, 'Filosofia da Educação', 1, 60, 1, 1),
(2, 'Metodologia da Pesquisa Educacional', 1, 60, 1, 1),
(3, 'Língua Portuguesa', 1, 60, 1, 1),
(4, 'Cálculo Vetorial e Geometria Analítica', 1, 60, 1, 1),
(5, 'Cálculo Diferencial I', 1, 90, 1, 1),
(6, 'Introdução à Física', 1, 60, 1, 1),
(7, 'Informática Básica', 1, 60, 1, 1),
(8, 'Sociologia da Educação', 2, 60, 0, 0),
(9, 'História da Educação', 2, 60, 0, 0),
(10, 'Cálculo Diferencial II', 2, 75, 0, 0),
(11, 'Física Geral I', 2, 75, 0, 0),
(12, 'Laboratório de Física I', 2, 30, 0, 0),
(13, 'Álgebra Linear', 2, 60, 0, 0),
(14, 'Química Geral e Inorgânica', 2, 60, 0, 0),
(15, 'Política Educacional e Organização da EBTT', 3, 60, 1, 3),
(16, 'Psicologia da Educação', 3, 60, 1, 3),
(17, 'Educação Inclusão e Diversidade', 3, 60, 1, 3),
(18, 'Equações Diferenciais e Ordinárias', 3, 60, 1, 3),
(19, 'Cálculo Diferencial III', 3, 75, 1, 3),
(20, 'Física Geral II', 3, 75, 1, 3),
(21, 'Laboratório de Física II', 3, 30, 1, 3),
(22, 'Didática', 4, 60, 0, 0),
(23, 'Inglês Instrumental', 4, 60, 0, 0),
(24, 'Libras', 4, 60, 0, 0),
(25, 'Física Geral III', 4, 75, 0, 0),
(26, 'Laboratório de Fisica III', 4, 30, 0, 0),
(27, 'Física Matemática I', 4, 90, 0, 0),
(28, 'Análise Vetorial', 4, 60, 0, 0),
(29, 'Prática de Ensino de Ciências', 5, 60, 1, 5),
(30, 'Estatística e Probabilidade', 5, 60, 1, 5),
(31, 'Mecânica Clássica I', 5, 60, 1, 5),
(32, 'Física Geral IV', 5, 75, 1, 5),
(33, 'Laboratório de Física IV', 5, 30, 1, 5),
(34, 'Termodinâmica', 5, 60, 1, 5),
(35, 'Avliação Educacional', 5, 45, 1, 5),
(36, 'Prática de Ensino de Física I e II', 6, 60, 0, 0),
(37, 'Eletromagnetismo I', 6, 75, 0, 0),
(38, 'Física Moderna', 6, 75, 0, 0),
(39, 'Informática Aplicada ao Ensino de Física', 6, 60, 0, 0),
(40, 'Instrumentação para o Ensino de Física', 6, 60, 0, 0),
(41, 'Mecânica Clássica II', 6, 60, 0, 0),
(42, 'Estágio Supervisionado I', 7, 225, 1, 7),
(43, 'Estrutura Quântica da Matéria', 7, 60, 1, 7),
(44, 'Física Estatística I', 7, 60, 1, 7),
(45, 'Prática de Ensino de Física III e IV', 7, 60, 1, 7),
(46, 'Projeto de Monografia', 7, 30, 1, 7),
(47, 'Cálculo Numérico', 7, 60, 1, 7),
(48, 'Estágio Supervisionado II', 8, 195, 0, 0),
(49, 'Monografia', 8, 30, 0, 0),
(50, 'Optativa I', 8, 60, 0, 0),
(51, 'Optativa II', 8, 60, 0, 0),
(52, 'Optativa III', 8, 60, 0, 0);

-- --------------------------------------------------------

--
-- Estrutura da tabela `disc_tce`
--

CREATE TABLE `disc_tce` (
  `id` int(11) NOT NULL,
  `nome` varchar(50) NOT NULL,
  `periodo` tinyint(3) UNSIGNED NOT NULL,
  `carga` int(10) UNSIGNED NOT NULL,
  `ativa` tinyint(1) NOT NULL DEFAULT 0,
  `parap` int(10) UNSIGNED NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Extraindo dados da tabela `disc_tce`
--

INSERT INTO `disc_tce` (`id`, `nome`, `periodo`, `carga`, `ativa`, `parap`) VALUES
(1, 'Língua Portuguesa', 1, 60, 1, 1),
(2, 'Matemática Aplicada', 1, 60, 1, 1),
(3, 'Física Aplicada', 1, 60, 1, 1),
(4, 'Química Aplicada', 1, 60, 1, 1),
(5, 'Desenho Técnico', 1, 45, 1, 1),
(6, 'Topografia Aplicada I', 1, 60, 1, 1),
(7, 'Metodologia do Trabalho Científico', 1, 60, 1, 1),
(8, 'Estatística', 2, 60, 0, 0),
(9, 'Cálculo Integral e Diferencial', 2, 60, 0, 0),
(10, 'Materiais de Construção', 2, 60, 0, 0),
(11, 'Desenho Arquitetônico I', 2, 45, 0, 0),
(12, 'Hidráulica Aplicada', 2, 60, 0, 0),
(13, 'Fundamentos da Computação', 2, 60, 0, 0),
(14, 'Topografia II', 2, 60, 0, 0),
(15, 'Inglês Instrumental', 3, 60, 1, 3),
(16, 'Hidrologia e Drenagem', 3, 60, 1, 3),
(17, 'Práticas Construtivas', 3, 60, 1, 3),
(18, 'Psicologia das Organizações', 3, 30, 1, 3),
(19, 'Desenho Arquitetônico II', 3, 45, 1, 3),
(20, 'Higiene e Segurança do Trabalho', 3, 45, 1, 3),
(21, 'Resistência dos Materiais', 3, 75, 1, 3),
(22, 'Desenho Assistido por Computador', 4, 75, 0, 0),
(23, 'Tecnologia das Construções', 4, 90, 0, 0),
(24, 'Mecânica dos Solos e Fundações', 4, 60, 0, 0),
(25, 'Estabilidade das Construções', 4, 75, 0, 0),
(26, 'Sistema Predial Hidráulico e Sanitário', 4, 75, 1, 4),
(27, 'Projeto Interdisciplinar I', 4, 15, 0, 0),
(28, 'Sistema Predial Elétrico e Telefônico', 5, 75, 0, 0),
(29, 'Gestão de Resíduos e Meio Ambiente', 5, 60, 1, 5),
(30, 'Conforto Ambiental', 5, 30, 1, 5),
(31, 'Legislação Previdenciária e Trabalhista', 5, 60, 1, 5),
(32, 'Gestão de Pessoas', 5, 60, 1, 5),
(33, 'Projeto Interdisciplinar II', 5, 15, 1, 5),
(34, 'Estrutura de Concreto Armado', 5, 75, 1, 5),
(35, 'Gestão de Empreendimentos de Construção Civil', 6, 60, 0, 0),
(36, 'Gestão de Suprimentos', 6, 60, 0, 0),
(37, 'Contabilidade Básica', 6, 60, 0, 0),
(38, 'Orçamento de Obra', 6, 75, 0, 0),
(39, 'Projeto Interdisciplinar III', 6, 15, 0, 0),
(40, 'Legislação Urbana e Ambiental', 6, 60, 0, 0),
(41, 'Estágio Supervisionado I', 6, 100, 0, 0),
(42, 'Planejamento e Gerenciamento de Obra', 7, 75, 1, 7),
(43, 'Manutenção Predial', 7, 60, 1, 7),
(44, 'Patologia e Terapia das Construções', 7, 60, 1, 7),
(45, 'Qualidade na Construção Civil', 7, 60, 1, 7),
(46, 'TCC', 7, 60, 1, 7),
(47, 'Ética Profissional', 7, 45, 0, 0),
(48, 'Estágio Supervisionado II', 7, 100, 1, 7);

-- --------------------------------------------------------

--
-- Estrutura da tabela `effetivate`
--

CREATE TABLE `effetivate` (
  `numero` varchar(25) NOT NULL,
  `query` text NOT NULL,
  `data` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Estrutura da tabela `inst_cadastro`
--

CREATE TABLE `inst_cadastro` (
  `id` int(10) UNSIGNED NOT NULL,
  `numero` varchar(25) DEFAULT NULL,
  `talkat` int(10) UNSIGNED DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Estrutura da tabela `messages`
--

CREATE TABLE `messages` (
  `id` int(10) UNSIGNED NOT NULL,
  `tag` varchar(20) NOT NULL,
  `text` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Extraindo dados da tabela `messages`
--

INSERT INTO `messages` (`id`, `tag`, `text`) VALUES
(1, '~getmatriz~', 'Matriz curricular de cada curso:\n> Administração (página 14): https://santaines.ifma.edu.br/wp-content/uploads/sites/14/2018/06/PROJETO-ADMINISTRA%C3%87%C3%83O.pdf\n> Engenharia da Computação: https://santaines.ifma.edu.br/wp-content/uploads/sites/14/2019/03/matriz_curricular_enge_comp.pdf\n> Física: https://santaines.ifma.edu.br/wp-content/uploads/sites/14/2019/02/matriz_curricular_fisica.pdf\n> TCE: https://santaines.ifma.edu.br/wp-content/uploads/sites/14/2018/10/MatrizCurEdific.pdf'),
(2, '~depart~', 'Reafirmo que você só deve contatar o departamento de tiver tendo problemas..//Este é o contato: ~numdepart~'),
(3, '~numdepart~', '98992437964');

-- --------------------------------------------------------

--
-- Estrutura da tabela `registro`
--

CREATE TABLE `registro` (
  `matricula` varchar(20) NOT NULL,
  `numero` varchar(25) NOT NULL,
  `talkat` int(10) UNSIGNED NOT NULL,
  `nome` varchar(75) DEFAULT NULL,
  `email` varchar(75) DEFAULT NULL,
  `curso` tinyint(1) UNSIGNED DEFAULT NULL,
  `turma` year(4) DEFAULT NULL,
  `cpf` char(11) DEFAULT NULL,
  `finished` tinyint(1) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Estrutura da tabela `req_adm`
--

CREATE TABLE `req_adm` (
  `id` int(11) NOT NULL,
  `discId` int(11) NOT NULL,
  `reqId` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Extraindo dados da tabela `req_adm`
--

INSERT INTO `req_adm` (`id`, `discId`, `reqId`) VALUES
(1, 8, 1),
(2, 9, 5),
(3, 9, 6),
(4, 10, 2),
(5, 13, 4),
(6, 14, 4),
(7, 15, 11),
(8, 16, 4),
(9, 16, 13),
(10, 17, 13),
(11, 18, 3),
(12, 18, 8),
(13, 19, 8),
(14, 20, 14),
(15, 21, 9),
(16, 22, 13),
(17, 23, 12),
(18, 24, 7),
(19, 25, 16),
(20, 26, 19),
(21, 27, 15),
(22, 28, 21),
(23, 29, 8),
(24, 29, 22),
(25, 30, 8),
(26, 31, 25),
(27, 32, 27),
(28, 33, 23),
(29, 34, 17),
(30, 34, 20),
(31, 35, 28),
(32, 36, 29),
(33, 37, 26),
(34, 38, 20),
(35, 39, 8),
(36, 40, 8),
(37, 40, 18),
(38, 41, 29),
(39, 42, 8),
(40, 42, 12),
(41, 43, 35),
(42, 44, 30),
(43, 45, 30),
(44, 46, 26),
(45, 47, 8),
(46, 48, 18),
(47, 48, 26),
(48, 49, 30),
(49, 50, 43),
(50, 51, 1),
(51, 52, 34),
(52, 52, 46),
(53, 52, 49),
(54, 53, 47),
(55, 54, 47),
(56, 55, 9),
(57, 57, 55),
(58, 58, 56),
(59, 1, 0),
(60, 2, 0),
(61, 3, 0),
(62, 4, 0),
(63, 5, 0),
(64, 6, 0),
(65, 7, 0),
(66, 11, 0),
(67, 12, 0);

-- --------------------------------------------------------

--
-- Estrutura da tabela `req_ec`
--

CREATE TABLE `req_ec` (
  `id` int(11) NOT NULL,
  `discId` int(10) UNSIGNED NOT NULL,
  `reqId` int(10) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Extraindo dados da tabela `req_ec`
--

INSERT INTO `req_ec` (`id`, `discId`, `reqId`) VALUES
(1, 8, 1),
(2, 8, 5),
(3, 9, 3),
(4, 10, 5),
(5, 11, 4),
(6, 11, 5),
(7, 12, 4),
(8, 12, 5),
(9, 13, 4),
(10, 14, 6),
(11, 14, 7),
(12, 15, 6),
(13, 15, 7),
(14, 17, 8),
(15, 18, 16),
(16, 19, 15),
(17, 20, 10),
(18, 21, 10),
(19, 22, 10),
(20, 22, 11),
(21, 22, 12),
(22, 23, 10),
(23, 23, 11),
(24, 23, 12),
(25, 24, 19),
(26, 25, 17),
(27, 26, 9),
(28, 27, 22),
(29, 27, 22),
(30, 28, 23),
(31, 28, 23),
(32, 29, 14),
(33, 30, 5),
(34, 31, 20),
(35, 31, 21),
(36, 31, 6),
(37, 32, 19),
(38, 33, 25),
(39, 34, 8),
(40, 34, 9),
(41, 36, 29),
(42, 37, 22),
(43, 38, 26),
(44, 39, 26),
(45, 40, 26),
(46, 40, 33),
(47, 41, 20),
(48, 41, 21),
(49, 42, 13),
(50, 42, 19),
(51, 43, 5),
(52, 44, 41),
(53, 45, 30),
(54, 45, 36),
(55, 46, 35),
(56, 47, 42),
(57, 50, 14),
(58, 51, 19),
(59, 52, 44),
(60, 53, 30),
(61, 58, 10),
(62, 60, 50),
(63, 62, 56),
(64, 1, 0),
(65, 2, 0),
(66, 3, 0),
(67, 4, 0),
(68, 5, 0),
(69, 6, 0),
(70, 7, 0),
(71, 16, 0),
(72, 35, 0),
(73, 48, 0),
(74, 49, 0),
(75, 54, 0),
(76, 55, 0),
(78, 57, 0),
(79, 59, 0),
(80, 61, 0),
(81, 63, 0);

-- --------------------------------------------------------

--
-- Estrutura da tabela `req_fis`
--

CREATE TABLE `req_fis` (
  `id` int(11) NOT NULL,
  `discId` int(10) UNSIGNED NOT NULL,
  `reqId` int(10) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Extraindo dados da tabela `req_fis`
--

INSERT INTO `req_fis` (`id`, `discId`, `reqId`) VALUES
(1, 9, 1),
(2, 10, 5),
(3, 11, 4),
(4, 11, 5),
(5, 11, 6),
(6, 12, 4),
(7, 12, 5),
(8, 12, 6),
(9, 13, 4),
(10, 16, 9),
(11, 18, 10),
(12, 19, 10),
(13, 20, 10),
(14, 20, 11),
(15, 20, 12),
(16, 21, 10),
(17, 21, 11),
(18, 21, 12),
(19, 22, 16),
(20, 25, 19),
(21, 25, 20),
(22, 26, 19),
(23, 26, 20),
(24, 27, 18),
(25, 27, 19),
(26, 28, 19),
(27, 29, 22),
(28, 30, 19),
(29, 31, 18),
(30, 31, 20),
(31, 31, 28),
(32, 32, 25),
(33, 32, 26),
(34, 33, 25),
(35, 33, 26),
(36, 34, 19),
(37, 34, 20),
(38, 35, 22),
(39, 36, 29),
(40, 37, 27),
(41, 37, 28),
(42, 37, 32),
(43, 38, 32),
(44, 39, 32),
(45, 40, 29),
(46, 41, 31),
(47, 42, 36),
(48, 42, 41),
(49, 43, 38),
(50, 44, 28),
(51, 44, 34),
(52, 44, 38),
(53, 45, 36),
(54, 45, 41),
(55, 47, 32),
(56, 48, 42),
(57, 49, 46),
(58, 1, 0),
(59, 2, 0),
(60, 3, 0),
(61, 4, 0),
(62, 5, 0),
(63, 6, 0),
(64, 7, 0),
(65, 8, 0),
(66, 14, 0),
(67, 15, 0),
(68, 17, 0),
(69, 23, 0),
(70, 24, 0),
(72, 50, 0),
(73, 51, 0),
(74, 52, 0);

-- --------------------------------------------------------

--
-- Estrutura da tabela `req_tce`
--

CREATE TABLE `req_tce` (
  `id` int(11) NOT NULL,
  `discId` int(11) NOT NULL,
  `reqId` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Extraindo dados da tabela `req_tce`
--

INSERT INTO `req_tce` (`id`, `discId`, `reqId`) VALUES
(1, 8, 2),
(2, 9, 2),
(3, 10, 4),
(4, 11, 5),
(5, 12, 2),
(6, 12, 3),
(7, 16, 12),
(8, 16, 14),
(9, 17, 10),
(10, 19, 11),
(11, 22, 19),
(12, 23, 17),
(13, 24, 21),
(14, 25, 21),
(15, 26, 17),
(16, 26, 19),
(17, 27, 7),
(18, 28, 26),
(19, 32, 18),
(20, 33, 27),
(21, 35, 32),
(22, 36, 17),
(23, 36, 26),
(24, 36, 28),
(25, 37, 8),
(26, 39, 33),
(27, 42, 35),
(28, 42, 36),
(29, 42, 38),
(30, 43, 17),
(31, 43, 23),
(32, 43, 26),
(33, 43, 35),
(34, 44, 17),
(35, 44, 23),
(36, 45, 35),
(37, 45, 36),
(38, 46, 7),
(39, 1, 0),
(40, 2, 0),
(41, 3, 0),
(42, 4, 0),
(43, 5, 0),
(44, 6, 0),
(45, 7, 0),
(46, 13, 0),
(47, 14, 0),
(48, 15, 0),
(49, 18, 0),
(50, 20, 0),
(51, 21, 0),
(52, 29, 0),
(53, 30, 0),
(54, 31, 0),
(55, 34, 0),
(56, 38, 0),
(57, 40, 0),
(58, 41, 0),
(59, 47, 0);

-- --------------------------------------------------------

--
-- Estrutura da tabela `user_adm`
--

CREATE TABLE `user_adm` (
  `id` int(11) NOT NULL,
  `matricula` varchar(20) DEFAULT NULL,
  `discId` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Estrutura da tabela `user_ec`
--

CREATE TABLE `user_ec` (
  `id` int(11) NOT NULL,
  `matricula` varchar(20) DEFAULT NULL,
  `discId` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Extraindo dados da tabela `user_ec`
--

INSERT INTO `user_ec` (`id`, `matricula`, `discId`) VALUES
(15, '20201ENG', 9),
(16, '20201ENG', 10);

-- --------------------------------------------------------

--
-- Estrutura da tabela `user_fis`
--

CREATE TABLE `user_fis` (
  `id` int(11) NOT NULL,
  `matricula` varchar(20) DEFAULT NULL,
  `discId` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Estrutura da tabela `user_tce`
--

CREATE TABLE `user_tce` (
  `id` int(11) NOT NULL,
  `matricula` varchar(20) DEFAULT NULL,
  `discId` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Índices para tabelas despejadas
--

--
-- Índices para tabela `cursos`
--
ALTER TABLE `cursos`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY (`abrev`),
  ADD UNIQUE KEY `nome` (`nome`);

--
-- Índices para tabela `disc_adm`
--
ALTER TABLE `disc_adm`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `nome` (`nome`);

--
-- Índices para tabela `disc_ec`
--
ALTER TABLE `disc_ec`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `nome` (`nome`);

--
-- Índices para tabela `disc_fis`
--
ALTER TABLE `disc_fis`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `nome` (`nome`);

--
-- Índices para tabela `disc_tce`
--
ALTER TABLE `disc_tce`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `nome` (`nome`);

--
-- Índices para tabela `effetivate`
--
ALTER TABLE `effetivate`
  ADD PRIMARY KEY (`numero`);

--
-- Índices para tabela `inst_cadastro`
--
ALTER TABLE `inst_cadastro`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `numero` (`numero`);

--
-- Índices para tabela `messages`
--
ALTER TABLE `messages`
  ADD PRIMARY KEY (`id`);

--
-- Índices para tabela `registro`
--
ALTER TABLE `registro`
  ADD PRIMARY KEY (`matricula`),
  ADD UNIQUE KEY `matricula` (`matricula`);

--
-- Índices para tabela `req_adm`
--
ALTER TABLE `req_adm`
  ADD PRIMARY KEY (`id`),
  ADD KEY `discId` (`discId`);

--
-- Índices para tabela `req_ec`
--
ALTER TABLE `req_ec`
  ADD PRIMARY KEY (`id`),
  ADD KEY `discId` (`discId`);

--
-- Índices para tabela `req_fis`
--
ALTER TABLE `req_fis`
  ADD PRIMARY KEY (`id`),
  ADD KEY `discId` (`discId`);

--
-- Índices para tabela `req_tce`
--
ALTER TABLE `req_tce`
  ADD PRIMARY KEY (`id`),
  ADD KEY `discId` (`discId`);

--
-- Índices para tabela `user_adm`
--
ALTER TABLE `user_adm`
  ADD PRIMARY KEY (`id`),
  ADD KEY `matricula` (`matricula`),
  ADD KEY `discId` (`discId`);

--
-- Índices para tabela `user_ec`
--
ALTER TABLE `user_ec`
  ADD PRIMARY KEY (`id`),
  ADD KEY `matricula` (`matricula`),
  ADD KEY `discId` (`discId`);

--
-- Índices para tabela `user_fis`
--
ALTER TABLE `user_fis`
  ADD PRIMARY KEY (`id`),
  ADD KEY `matricula` (`matricula`),
  ADD KEY `discId` (`discId`);

--
-- Índices para tabela `user_tce`
--
ALTER TABLE `user_tce`
  ADD PRIMARY KEY (`id`),
  ADD KEY `matricula` (`matricula`),
  ADD KEY `discId` (`discId`);

--
-- AUTO_INCREMENT de tabelas despejadas
--

--
-- AUTO_INCREMENT de tabela `cursos`
--
ALTER TABLE `cursos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de tabela `disc_adm`
--
ALTER TABLE `disc_adm`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=59;

--
-- AUTO_INCREMENT de tabela `disc_ec`
--
ALTER TABLE `disc_ec`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=64;

--
-- AUTO_INCREMENT de tabela `disc_fis`
--
ALTER TABLE `disc_fis`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=53;

--
-- AUTO_INCREMENT de tabela `disc_tce`
--
ALTER TABLE `disc_tce`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=49;

--
-- AUTO_INCREMENT de tabela `inst_cadastro`
--
ALTER TABLE `inst_cadastro`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de tabela `messages`
--
ALTER TABLE `messages`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de tabela `req_adm`
--
ALTER TABLE `req_adm`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=69;

--
-- AUTO_INCREMENT de tabela `req_ec`
--
ALTER TABLE `req_ec`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=82;

--
-- AUTO_INCREMENT de tabela `req_fis`
--
ALTER TABLE `req_fis`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=75;

--
-- AUTO_INCREMENT de tabela `req_tce`
--
ALTER TABLE `req_tce`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=60;

--
-- AUTO_INCREMENT de tabela `user_adm`
--
ALTER TABLE `user_adm`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de tabela `user_ec`
--
ALTER TABLE `user_ec`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT de tabela `user_fis`
--
ALTER TABLE `user_fis`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de tabela `user_tce`
--
ALTER TABLE `user_tce`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- Restrições para despejos de tabelas
--

--
-- Limitadores para a tabela `user_adm`
--
ALTER TABLE `user_adm`
  ADD CONSTRAINT `user_adm_ibfk_1` FOREIGN KEY (`matricula`) REFERENCES `registro` (`matricula`),
  ADD CONSTRAINT `user_adm_ibfk_2` FOREIGN KEY (`discId`) REFERENCES `disc_adm` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
