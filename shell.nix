{ pkgs ? import <nixpkgs> {} } : let 

  regularPackages = with pkgs; [ nodejs_22 ];
  
  nodePackages = with pkgs.nodePackages; [
    typescript-language-server
    postcss postcss-cli
    nodemon
  ];

in pkgs.mkShell {

  buildInputs = (regularPackages ++ nodePackages);

  shellHook = ''
    echo "Welcome to the Node.js development shell!"
    echo "Node.js version: $(node -v)"
    npm install
  '';
}