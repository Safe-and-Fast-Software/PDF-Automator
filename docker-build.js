// Builds the docker images and pushes them to docker hub.

import fs from 'fs';
import { exec as execCallback } from 'child_process';
import { promisify } from 'util';
import dotenv from 'dotenv';

dotenv.config();
const DOCKER_USERNAME = process.env.DOCKER_USERNAME;
if (! DOCKER_USERNAME) throw new Error("Please add your docker username as 'DOCKER_USERNAME' in .env");

const exec = promisify(execCallback);

console.log({DOCKER_USERNAME});

const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
const version = packageJson.version;

async function build(image) {
    
    const logger = (error, stdout, stderr) => {
  
        if (error) return console.error(`Error: ${error.message}`);
        if (stderr) return console.error(`Stderr: ${stderr}`);
      
        console.log(`Stdout: ${stdout}`);
    };

    /* build and upload version specified in package.json */ {
        const imageName = `${DOCKER_USERNAME}/${image.name}:v${version}`
        await exec(`docker build -t ${imageName} -f ${image.dockerFile} .`, logger);    
        await exec(`docker push ${imageName}`, logger);    
    }
    
    /* Create and upload under latest tag as well */ {
        const imageName = `${DOCKER_USERNAME}/${image.name}:latest`
        await exec(`docker build -t ${imageName} -f ${image.dockerFile} .`, logger);    
        await exec(`docker push ${imageName}`, logger);    
    }
    
}

build({ name: "pdf-automator-server",   dockerFile:"dockerfile.server"   });
build({ name: "pdf-automator-database", dockerFile:"dockerfile.database" });
