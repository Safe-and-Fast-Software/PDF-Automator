{ pkgs ? import <nixpkgs> {} } : pkgs.mkShell {

  buildInputs = with pkgs; [
    nodejs
    nodePackages.nodemon
    nodePackages.typescript-language-server
  ];

  shellHook = ''
    echo "Welcome to the Node.js development shell!"
    echo "Node.js version: $(node -v)"
    echo "If you haven't done so already, run:"
    echo ""
    echo "  npm intall"
    echo ""
    echo "to install the needed libraries."
  '';
}
