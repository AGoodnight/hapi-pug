#!/usr/bin/env node

"use strict";

const Hapi = require('hapi');
const Boom = require('boom');
const Inert = require('inert');
const Vision = require('vision');
const Path = require('path');
const IP = require('ip');

// Server 1
const SERVER = new Hapi.Server();

SERVER.connection({
  port:3001,
  host:'localhost',
  routes:{
    files: {
        relativeTo: Path.join(__dirname, 'static')
    }
  }
});


const provision = async() => {

    await SERVER.register(Inert);
    await SERVER.register(Vision);

    let ipAddress = IP.address();

    // Pug Template
    SERVER.views({
      engines:{
        pug:require('pug')
      },
      relativeTo:__dirname,
      path:'pug',
      layoutPath:'pug/layout',
      compileOptions:{
        pretty:true,
        doctype:'html'      }
    });

    SERVER.route({
      method:'GET',
      path:'/',
      config:{
        handler: function(request,reply){
          reply.view('index',{
            'title':'Hapi-Pug-Frontend'
          });
        }
      }
    });

    SERVER.route({
      method:'GET',
      path:'/image',
      handler:function(request,reply){
        return reply.file('./photos/hedgehog.jpg').code(200);
      }
    });

    // API -- static directory
    SERVER.route({
      method:'GET',
      path:'/static',
      handler:function(){
        throw Boom.forbidden("Not at the moment");
      }

    });

    SERVER.route({
        method: 'GET',
        path: '/static/{param*}',
        handler: {
            directory: {
                path: '.',
                redirectToSlash: true,
                index: true,
            }
        }
    });
    
    await SERVER.start((err)=>{
      if(err){
        console.log('An Error Occured, Hapi could not run at ${SERVER.info.uri}');
      }else{
        console.log('Server running at:', ipAddress+':'+SERVER.info.uri);
      }
    });

};

provision();
