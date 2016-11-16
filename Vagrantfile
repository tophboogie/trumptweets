# -*- mode: ruby -*-
# vi: set ft=ruby :

Vagrant.configure(2) do |config|

  config.vm.box = "ubuntu/trusty64"

  # config.vm.box_check_update = false

  config.vm.network "private_network", type: "dhcp"
  config.vm.network :forwarded_port, guest: 3000, host: 3000

  config.vm.provision :shell, path: "bootstrap.sh"

  config.vm.provider "virtualbox" do |v|
    v.memory = 2048
    v.cpus = 2
  end

end
