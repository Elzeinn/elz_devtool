fx_version "cerulean"

description ""
author "Bear#6792"
version '1.0.0'
lua54 'yes'
game "gta5"

ui_page 'web/build/index.html'

shared_scripts {
	'@ox_lib/init.lua',
}

shared_scripts {
	'shared/init.lua',
}

client_script "client/**/*"
server_script "server/**/*"

files {
	'web/build/index.html',
	'web/build/**/*',
	'client/dataview.lua',
}
