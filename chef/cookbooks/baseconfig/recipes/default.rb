# Make sure the Apt package lists are up to date, so we're downloading versions that exist.
cookbook_file "apt-sources.list" do
  path "/etc/apt/sources.list"
end

execute 'apt_update' do
  command 'apt-get update'
end

# Base configuration recipe in Chef.
package "wget"
package "ntp"
package "postgresql"
package "nginx"

cookbook_file "ntp.conf" do
  path "/etc/ntp.conf"
end

execute 'ntp_restart' do
  command 'service ntp restart'
end

cookbook_file "nginx" do
  path "/etc/nginx/sites-available/default"
end

service 'nginx' do
  action :reload
end

# Installing NodeJS
execute 'get_setup' do
  command 'curl -sL https://deb.nodesource.com/setup_8.x | sudo -E bash -'
end

execute 'install_nodejs' do
  command 'sudo apt-get install -y nodejs'
end

# Installing npm packages
execute "install_packages" do
  command "sudo npm install --silent"
  cwd "/home/vagrant/project"
  user 'vagrant'
end

# Installing npm package forever
execute "install_forever" do
  command "sudo npm install -g forever"
  cwd "/home/vagrant/project"
end

# Create databases
execute 'create_dbs' do
  command 'echo "CREATE DATABASE database_dev; CREATE USER vagrant WITH PASSWORD \'vagrant\'; GRANT ALL PRIVILEGES ON DATABASE database_dev TO vagrant; ALTER USER vagrant CREATEDB;" | sudo -u postgres psql'
end

# Execute db migrations
execute "run_migrations" do
  command "sudo node_modules/.bin/sequelize db:migrate"
  cwd "/home/vagrant/project"
end

# # run server
# execute "run_server" do
#   command "forever start ./bin/www"
#   cwd "/home/vagrant/project"
# end