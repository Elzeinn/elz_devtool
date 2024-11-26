fx_version "cerulean"

description "Projecat Dev Tools 17Movement"
author "Elzein"
version '1.1.0'
lua54 'yes'
game "gta5"

ui_page 'web/build/index.html'

shared_scripts {
	'shared/*.lua'
}

client_script "client/**/*"
server_script "server/**/*"

files {
	'web/build/index.html',
	'web/build/**/*',
}
