import { create, Whatsapp } from 'venom-bot'
import mysql from 'mysql2/promise'
import { Client, Intents } from 'discord.js'
import * as fs from 'fs'
import pkg from 'gerador-validador-cpf'
const { validate } = pkg
//import * as readline from 'readline-sync'

export { create, Whatsapp, mysql, Client, Intents, fs, validate }