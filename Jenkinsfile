pipeline {
  agent {
    node {
      label 'nodejs'
    }
  }
  stages {
    stage('checkout') {
      steps {
        checkout(scm)
        script {
          env.imageTag = sh (script: 'git rev-parse --short HEAD', returnStdout: true).trim()
        }
      }
    }
    stage('package') {
      steps {
        container('nodejs') {
          sh '''npm install --registry https://registry.npm.taobao.org
npm run build'''
        }

      }
    }
    stage('docker build') {
      agent none
        steps {
          container('nodejs') {
            sh 'docker build -t 172.34.120.87:9443/transwarp/e03-dfh-service-front:$imageTag .'
            withCredentials([usernamePassword(credentialsId : 'harbor' ,passwordVariable : 'DOCKER_PASSWORD' ,usernameVariable : 'DOCKER_USERNAME' ,)]) {
              sh '''echo "$DOCKER_PASSWORD" | docker login 172.34.120.87:9443 -u "$DOCKER_USERNAME" --password-stdin
docker push 172.34.120.87:9443/transwarp/e03-dfh-service-front:$imageTag'''
              }
          }
       }
    }
    stage('deploy') {
      agent none
        steps {
          container('nodejs') {
            withCredentials([kubeconfigFile(credentialsId : 'kubeconfig' ,variable : 'KUBECONFIG' ,)]) {
              sh 'envsubst < deployment.yml | kubectl apply -f -'
            }
          }
        }
      }
  }
}
