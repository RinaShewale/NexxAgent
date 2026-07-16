import express from "express";
import morgan from "morgan";
import { createProxyMiddleware } from "http-proxy-middleware";

const app = express();

app.use(morgan("dev"));

const Proxies = {};
const AgentProxies = {};



function getProxy(sandboxID) {

  if (Proxies[sandboxID]) {
    return Proxies[sandboxID];
  }


  Proxies[sandboxID] = createProxyMiddleware({

    target: `http://sandbox-service-${sandboxID}:5173`,

    changeOrigin: false,

    ws: true,

    xfwd: true,

    logLevel: "debug",


    onProxyReq(proxyReq, req) {

      console.log(
        "Preview Proxy:",
        req.method,
        req.url
      );

    },


    onError(err, req, res) {

      console.error(
        "Preview Proxy Error:",
        err.message
      );


      if (!res.headersSent) {

        res.writeHead(502, {
          "Content-Type": "text/plain",
        });

      }

      res.end("Preview Proxy Error");

    }

  });


  return Proxies[sandboxID];

}




function getAgentProxy(sandboxID) {


  if (AgentProxies[sandboxID]) {
    return AgentProxies[sandboxID];
  }



  AgentProxies[sandboxID] = createProxyMiddleware({

    target: `http://sandbox-service-${sandboxID}:3000`,

    changeOrigin: false,

    ws: true,

    xfwd: true,

    logLevel: "debug",



    onProxyReq(proxyReq, req) {

      console.log(
        "Agent Proxy:",
        req.method,
        req.url
      );

    },



    onError(err, req, res) {

      console.error(
        "Agent Proxy Error:",
        err.message
      );


      if (!res.headersSent) {

        res.writeHead(502, {
          "Content-Type": "text/plain",
        });

      }

      res.end("Agent Proxy Error");

    }

  });


  return AgentProxies[sandboxID];

}




app.get(
  "/api/status/healthz",
  (_, res) => {

    res.json({
      status:"ok"
    });

  }
);



app.get(
  "/api/status/readyz",
  (_, res) => {

    res.json({
      status:"ready"
    });

  }
);





// preview.localhost and agent.localhost routing

app.use((req,res,next)=>{


  const host = req.headers.host || "";



  if (
    !host.endsWith(".preview.localhost") &&
    !host.endsWith(".agent.localhost")
  ) {

    return next();

  }




  const parts = host.split(".");

  const sandboxID = parts[0];
  const type = parts[1];



  if(type === "preview") {

    return getProxy(sandboxID)(
      req,
      res,
      next
    );

  }



  if(type === "agent") {

    return getAgentProxy(sandboxID)(
      req,
      res,
      next
    );

  }



  return next();


});






// Sandbox Agent API Proxy

app.use(

  createProxyMiddleware({

    target:"http://sandbox-service:3000",

    changeOrigin:true,

    logLevel:"debug",



    onProxyReq(proxyReq, req) {

      console.log(
        "Sandbox API Proxy:",
        req.method,
        req.url
      );

    },


    onError(err,req,res){


      console.error(
        "Sandbox API Proxy Error:",
        err.message
      );



      if(!res.headersSent){

        res.writeHead(502,{
          "Content-Type":"text/plain"
        });

      }


      res.end(
        "Sandbox API Proxy Error"
      );

    }


  })

);



export default app;