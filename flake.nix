{
  description = "A Node.js development environment";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-24.11";
  };

  outputs = { self, nixpkgs }: {

    devShells.default = nixpkgs.mkShell {
    
      buildInputs = [
        nixpkgs.nodejs
      ];

      shellHook = ''
        echo "Welcome to the Node.js development shell!"
        echo "Node.js version: $(node -v)"
      '';
    };
  };
}
