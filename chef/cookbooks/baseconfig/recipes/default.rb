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
cookbook_file "ntp.conf" do
  path "/etc/ntp.conf"
end
execute 'ntp_restart' do
  command 'service ntp restart'
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
