node {
    def app

    stage('Clone repository') {
        checkout scm
    }

    stage('Test security') {
      sh 'npm audit'
    }

    stage('Test functionality') {
        app.inside {
            sh 'node_modules/.bin/mocha'
        }
    }

    stage('Build Docker image') {
        app = docker.build("ciscofu/cicdtest")
    }

    stage('Push image') {
      /*
        docker.withRegistry('https://registry.hub.docker.com', 'docker-hub-credentials') {
            app.push("${env.BUILD_NUMBER}")
            app.push("latest")
        }
      */
    }
}