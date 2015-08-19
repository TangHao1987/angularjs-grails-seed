# angularjs-grails-seed

A seed project for angular-js running on grails

This project demo how to integrate angularjs into grails easily.

This project contains the initial setting for the grails to run angular js.

## Why using grails for angularJS?
Grails is really awesome framework with greatfully reduced efforts to setup project, server, and it also makes coding for backend be simple and easy. But the for the view layer I like angularJS more as it highly modulized. combine of this two technology makes the development become very simple!

## Tech stack
##### backend technology
- [Grails] Grails 2.3.7
- [Assert-pipeline] Assert-pipeline plug-in for grails for the javascript and css management

##### frontend technology
- [AngularJS] angularJS framework
- [bower] for front end library management
- [bootstrap] to demo how to add css..

pre request:
- Node js need to be installed, as bower is used to manage the front end packages
- need to run bower install to install bower components on the project root d
- need to run grails target "refresh-dependencies" to install the asset plug in before run-app
