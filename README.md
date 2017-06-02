# sails-datatable-demo

## Intallation

#### Requirements
- PostgreSQL database has been setup and run.   
- Yarn has been installed (https://yarnpkg.com/en/docs/getting-started)
 
#### Now you can follow the steps below to setup the demo:
- Go to project root directory and install dependencies with yarn:    
```yarn install```  

- Go to config directory and then rename local.js.example to local.js to config your local environment

- Update the ```datastores.default.url``` configuration to connect with the your PostgreSQL database.  
The url format is ```postgres://username:password@hostname:port/database```

-  Run the command below in the project root directory to start application:  
```yarn start-sails```

- Init the database by accessing to the url below:  
http://localhost:1337/init-data

Now you can view the datatable demo page at the following url:
http://localhost:1337/datatable