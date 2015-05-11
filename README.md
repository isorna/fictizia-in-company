# Node.js

## [Setup Git and basic commands](http://git-scm.com/book/es/v1/Empezando-Configurando-Git-por-primera-vez)

* Setup `git: git config remote.origin.push HEAD`.
 * `git config --global user.name "John Doe"`.
 * `git config --global user.email johndoe@example.com`.
* Git commands: `git status, git add, git rm, git pull, git commit -m "Commit message", git push`.

## First steps with Node.js

Follow the installation steps from [nodejs.org](http://nodejs.org), you'll need a terminal interface while working with Node.js.

### What can be done with Node.js?

With Node.js you can access filesystem, import C/C++ dll's or create and manage servers, like a web server, an ftp server or a tcp server.First steps with Node.js

Node.js gives us a JavaScript interface to use Google's V8 engine, and that interface includes extra modules and utilities for us to implement our server applications.

We can use Node.js for building automated processes that we'll use in our server applications, like a builder for our configuration files.First steps with Node.js

Later we'll learn to use Node.js for building a REST API, or a terminal client (CLI), or manage our databases.

In order to execute a JavaScript file with Node.js, just type from the terminal:

```
node filename.js
```

### Process arguments

In Node.js you can access your current process arguments with a native variable:

```
process.argv.forEach(console.log);
```

Remember that your real process arguments will start at the third position of the array.

### Simple HTTP Server

We can build a simple HTTP server with a few lines of code:

```
var http = require("http");

http.createServer(function(request, response) {
  response.writeHead(200, {"Content-Type": "text/plain"});
  response.write("Hello World");
  response.end();
}).listen(process.env.PORT, process.env.IP);
```

In this example, we can see the `require` method being used to import the http module for our own process.

__Practice:__ build an script that automatize our `manifest.appcache` file, take a look at [PRACTICE.md](PRACTICE.md) for reference.

---

### [Modularity](https://nodejs.org/api/modules.html)

If we want to make a good application with Node.js, we must learn to modularize our code, so that we can `require` them whenever they're necessary. You can use `export` from a module to allow access to your module's functionality:

```
// server.js
var http = require("http"),
    url = require("url");

function serverStart() {
    http.createServer(function(request, response) {
        var pathname = url.parse(request.url).pathname;
        console.log("Received petition for " + pathname);
        response.writeHead(200, {"Content-Type": "text/html"});
        response.write("What's up?");
        response.end();
    }).listen(process.env.PORT, process.env.IP);
    console.log("Server started...");
}

exports.start = serverStart;
```

And then use `require` to import it, and use its exported methods:

```
// app.js
var server = require('server');

server.start();
```
__Practice:__ Let's start mocking our web server application, create different files for your app and the server module, and import it from your app file.

### The Router

Let's take a look at an URL structure:

```
                               url.parse(string).query
                                           |
           url.parse(string).pathname      |
                       |                   |
                       |                   |
                     ------ -------------------
http://localhost:8888/start?foo=bar&hello=world
                                ---       -----
                                 |          |
                                 |          |
        querystring.parse(string)["foo"]    |
                                            |
                   querystring.parse(string)["hello"]
```

Here we can see which Node.js modules should be used when parsing the request's URL, in order to achieve a correct interpretation and build a router.

__Practice:__ create a router module that exports a single method `route`, that should be passed to our `server.start` method.

Now let's talk about the __Request Handler__ concept. We don't want our router to be responsible of how each request is handled, as that would lead us to a non scalable situation.

We'll have to build a request handling module, so that we've some way of storing each possible route of our application, and different methods that will trigger whenever those routes are requested, if there's no handler for a given route, our router will act accordingly if necessary.

__Practice:__ create a request handler module, so that it can use different handler methods, and they can be assigned to each configured route. The router must be modified so that it'll check requested handler exists, or redirect to a 404 message page.

### Wiring all together

Now that we know how to use the `fs` module to access our system information, and how to create and manage a server and handle its routes, it's the moment to build a complete server application, please refer to [PRACTICE.md](PRACTICE.md) #3 task for further detail.

---

## Building a complete static files web server

In order to build a working web server, we must understand how to serve different files from it without blocking the server process.

### Using the [Buffer](https://nodejs.org/api/buffer.html) class

Pure JavaScript is Unicode friendly but not nice to binary data. When dealing with TCP streams or the file system, it's necessary to handle octet streams. Node has several strategies for manipulating, creating, and consuming octet streams.

Raw data is stored in instances of the `Buffer` class. A `Buffer` is similar to an array of integers but corresponds to a raw memory allocation outside the V8 heap. A `Buffer` cannot be resized.

The `Buffer` class is a global, making it very rare that one would need to ever `require('buffer')`.

### Using the [Stream](https://nodejs.org/api/stream.html) class

A stream is a concept that was popularized in the early days of unix. It is an input/output (I/O) mechanism for transmitting data from one program to another. The streaming data is delivered in chunks which allows for efficient use of memory and realtime communication.

Here is a very simple example of reading a stream from file and piping to an HTTP response:

```
var fs = require('fs'),
    http = require('http');

var server = http.createServer(function (req, res) {
  // logic here to determine what file, etc
  var rstream = fs.createReadStream('existingFile');
  rstream.pipe(res); // pipe file to response
});
```

__[Why use them in building applications?](http://codewinds.com/blog/2013-07-25-streams-what-why.html)__

* Smaller, focused modules.
* Standard API for input/output which can even cross process boundaries.
* Streams can allow us to use less memory and serve more concurrent users.
* Realtime updates using streams and sockets.

A Node.js stream is an abstract interface implemented by various objects in Node. For example a request to an __HTTP server__ is a stream, as is __stdout__. Streams are readable, writable, or both. All streams are instances of __EventEmitter__.

You can load the Stream base classes by doing `require('stream')`. There are base classes provided for __Readable__ streams, __Writable__ streams, __Duplex__ streams, and __Transform__ streams.

__Listening to stream events__

Node.js streams are event emitters so you can listen to its events to monitor the data being transmitted.

```
var dataLength = 0;
// using a readStream that we created already
rstream
  .on('data', function (chunk) {
    dataLength += chunk.length;
  })
  .on('end', function () {  // done
    console.log('The length was:', dataLength);
  });
```

You can also pipe chains so that the file content is processed:

```
var r = fs.createReadStream('file.txt');
var z = zlib.createGzip();
var w = fs.createWriteStream('file.txt.gz');
r.pipe(z).pipe(w);
```

Or interact with the terminal process:

```
process.stdin.pipe(process.stdout);
```

[Duplex](https://nodejs.org/api/stream.html#stream_class_stream_duplex_1) streams are streams that implement both the __Readable__ and __Writable__ interfaces.

[Transform](https://nodejs.org/api/stream.html#stream_class_stream_transform_1) streams are __Duplex__ streams where the output is in some way computed from the input. They implement both the __Readable__ and __Writable__ interfaces.

---

### Using the request POST method

In order to receive POST parameters, we'll need to listen to the `data`  and `end` events of our `request`, and then parse the result in a JSON format, so that we can work with those parameters.

Once we have received our POST parameters, we'll have to create a suitable `response`, be it a file or a manufactured stream.

Take a look at `router.js` and `request_handler.js` for code explanation.

### [Using zlib](https://nodejs.org/api/zlib.html)

```
var zlib = require('zlib');
```

This provides bindings to Gzip/Gunzip, Deflate/Inflate, and DeflateRaw/InflateRaw classes. Each class takes the same options, and is a readable/writable Stream.

Take a look at `examples\zlib.js` for code explanation.

### Watching changes on a file

Both of these implementations are unstable right now, but they' can be used to achieve different strategies.

In order to understand how changes on a file works, we should also know a little more about [stat, fstat and lstat linux commands](http://linux.die.net/man/2/fstat).

__[fs.watchFile(filename[, options], listener)](https://nodejs.org/api/fs.html#fs_fs_watchfile_filename_options_listener)__

```
fs.watchFile('message.text', function (curr, prev) {
    console.log('the current mtime is: ' + curr.mtime);
    console.log('the previous mtime was: ' + prev.mtime);
});
```

__[fs.watch(filename[, options][, listener])](https://nodejs.org/api/fs.html#fs_fs_watch_filename_options_listener)__

```
fs.watch('somedir', function (event, filename) {
    console.log('event is: ' + event);
    if (filename) {
        console.log('filename provided: ' + filename);
    } else {
        console.log('filename not provided');
    }
});
```

### TCP Sockets

* [Net Module](https://nodejs.org/api/net.html).
* [A simple TCP based chat server written in node.js](https://gist.github.com/creationix/707146).

## WebSockets

__Why Socket.io isn't always the best solution?__, just because will try to proxy HTML5 WebSockets implementation, if the actual browser doesn't follow it, so that Socket.io will load an Ajax, Flash or iFrame alternative, using more latency and bandwith. 

* [WebSocket Node project](https://github.com/theturtle32/WebSocket-Node).
* [Node.js and Websocket simple chat tutorial](http://ahoj.io/nodejs-and-websocket-simple-chat-tutorial).
* [Using Node.js and Websockets to Build a Chat Service](http://code.tutsplus.com/tutorials/using-nodejs-and-websockets-to-build-a-chat-service--net-34482).

## Firebase

[Using Firebase from Node.js](https://www.firebase.com/docs/web/quickstart.html).

---

Now that we now how to read, save and modify data with Firebase, it's time to modify our app so that we have a full operational application. Take a look at [PRACTICE.md](PRACTICE.md) #8 and #9.

You'll find useful to know that there're some [Node.js Globals](https://nodejs.org/docs/latest/api/globals.html) available to you to simplify your work.

Also, remember that we can use our response to send cookies inside the header to our clients, so that you'll be able to inform them about their actions progress. If you don't set an expiration date, they'll be alive for the current session only.

## [Express](http://expressjs.com/)

Express is a minimal and flexible Node.js web application framework that provides a robust set of features for web and mobile applications.

With a myriad of HTTP utility methods and middleware at your disposal, creating a robust API is quick and easy.

Express provides a thin layer of fundamental web application features, without obscuring Node features that you know and love.

Develop model-driven apps with an Express-based framework. Find out more at loopback.io.

__Installation__

```
npm install -g express
```

We can also use the Express [Generator](http://expressjs.com/starter/generator.html), `express`, to quickly create a application skeleton.

```
npm install express-generator -g
```

Take a look at `hello-world.js` example for your first code introduction with express.

An Express application is essentially a series of [middleware](http://expressjs.com/guide/using-middleware.html) calls.

With express, we can have [more than one handler function for each route](http://expressjs.com/guide/routing.html). Remember that you always need to terminate the request response cycle, or the request will be left hanging.

__Warning:__ be careful with how you handle routes, sub-stacks and route redirections, things may get messy!.

Serving [static files with express is very easy](http://expressjs.com/starter/static-files.html), and allows you to combine different static folders or simulate virtual folders for your files. Take a look at `static-server.js` for code explanation.

__How do you handle 404s?__

In Express, 404s are not the result of an error. Therefore, the error-handler middleware will not capture 404s. This is because a 404 is simply the absence of additional work to do; in other words, Express has executed all middleware / routes, and found that none of them responded. All you need to do is add a middleware at the very bottom (below all others) to handle a 404:

```
app.use(function(req, res, next) {
    res.status(404).send('Sorry cant find that!');
});
```

__How do you setup an error handler?__

You define error-handling middleware the same way as other middleware, except with four arguments instead of three; specifically with the signature (err, req, res, next):

```
app.use(function(err, req, res, next) {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});
```

__How do I render plain HTML?__

You don’t! There’s no need to “render” HTML with `res.render()`. If you have a specific file, use `res.sendFile()`. If you are serving many assets from a directory use the `express.static()` middleware.

__Working with the debugger__

Express comes with a [built-in debugger](http://expressjs.com/guide/debugging.html), for more documentation on the `debug` see the [debug guide](https://github.com/visionmedia/debug).

```
DEBUG=express:* node index.js
```

---

__Ajax Calls with express__

Now that we know how to handle standard requests, we could also use `express` to handle ajax calls, in order to setup our single-page app.

Take a look at examples/express/ajax-calls for code explanation.

```
// ajax-server.js
var express = require("express"),
    app = express.createServer();

app.use(express.bodyParser());
app.post('/search', function(req, res){
   var oSearchForm = req.body;  // <-- search items
   var MySearch = { // mockup database search service
        doSearch: function (poSearchForm) {
            var oReturnItems = [];
            // search database here and return found items...
            return oReturnItems;
   }};
   
   MySearch.doSearch(oSearchForm,function(poError, poItems) {
       res.send(poItems);
   });
});

app.listen(process.env.PORT);
```

Here's a simple ajax client html page for testing purpose.

```
<!-- ajax-client.html -->
<!doctype html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Ajax example</title>
</head>

<body>
    <h1>Ajax example</h1>
    <form method="post" action="/search">
        <p><label for="firstname">First name:</label>
        <input type="text" name="firstname" id="firstname" /></p>
        <p><label for="lastname">Last Name:</label>
        <input type="text" name="lastname" id="lastname" /></p>
        <input type="submit" value="Save"/>
    </form>
    <div id="results">
        <p><strong>Results:</strong></p>
    </div>
    <script type="text/javascript" src="//ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js"></script>
    <script>
        $.ajax( {
          url: '/search',
          data: parseFormToJSON('form'),
          type: 'POST',
          success: function(items) {
              /* do something with items here */
              // You will likely want a template so you don't have to format the string by hand
            for( var item in items ) {
               $('#results').append('<div>'+item.interestingField+'</div>');
            }
          }
        });
        function parseFormToJSON (pcSelector) {
            var aFieldsArray = $(pcSelector).serializeArray(),
                oJSON = {},
                i = 0;
            
            for (i = 0; i < aFieldsArray.length; i++) {
                oJSON[aFieldsArray[i].name] = aFieldsArray[i].value;
            }
            
            return oJSON;
        }
    </script>
</body>
</html>
```

__Our first express project__

Let's start our new `express` app right away:

```
express express-app

cd express-app

npm install

```

If you want to have [Nodemon](https://github.com/remy/nodemon) service active, just install it and use it instead of node:

```
npm install -g nodemon

nodemon app.js

```

Once we've followed this steps, you'll be able to see `package.json` fully configured. Take a look at it, and observe `scripts` and `dependencies` sections closely.

As you see, our project has been created with some of the most useful node modules, like `body-parser`, `cookie-parser`, `debug`, `express`, `jade`, `morgan` and `serve-favicon`. Feel free to read their README.md's, as you'll use them frecuently.

Open `bin/www` and run it with node command from c9.io toolbar to start your app.

__Jade Templates__

First of all, you must have the [Jade Documentation](http://jade-lang.com/reference) at hand, as there're multiple commands that you'll have to learn, as with every new language.

Jade is meant for writting html templates with less code, and using shortcodes for loops, variables and includes.

__Important:__ don't forget to always use the same number of spaces or tabs for each indent level, or Jade will not work at all.

Express is prepared for [working with Jade by default](http://expressjs.com/guide/using-template-engines.html), but you can also [use or develop other express-compatible template engines](http://expressjs.com/advanced/developing-template-engines.html), like [Swig](http://paularmstrong.github.io/swig/docs/#express) if you like.

Finally, Jade also allows us to [include files inside templates](http://jade-lang.com/reference/includes/), so that we'll be able to build our template system as complex as we like.

---

## MongoDB

### [What is NoSQL?](https://www.mongodb.com/nosql-explained)

NoSQL encompasses a wide variety of different database technologies that were developed in response to a rise in the volume of data stored about users, objects and products, the frequency in which this data is accessed, and performance and processing needs. Relational databases, on the other hand, were not designed to cope with the scale and agility challenges that face modern applications, nor were they built to take advantage of the cheap storage and processing power available today.

### MongoDB basics

MongoDB is designed for how we build and run applications with modern development techniques, programming models, computing resources, and operational automation.

__How We Build Applications__

* New and Complex Data Types. Rich data structures with dynamic attributes, mixed formats, text, media, arrays and other complex types are common in today’s applications.
* Flexibility. Applications have evolving data models, because certain attributes are initially unknown, and because applications evolve over time to accommodate new features and requirements.
* Modern Programming Languages. Object oriented programming languages interact with data in structures that are dramatically different from the way data is stored in a relational database.
* Faster Development. Software engineering teams now embrace short, iterative development cycles. In these projects defining the data model and application functionality is a continuous process rather than a single event that happens at the beginning of the project.

__How We Run Applications__

* New Scalability for Big Data. Operational and analytical workloads challenge traditional capabilities on one or more dimensions of scale, availability, performance and cost effectiveness.
* Fast, Real-time Performance. Users expect consistent, low-latency, interactive experiences from applications across many types of interfaces.
* New Hardware. The relationship between cost and performance for compute, storage, network and main memory resources has changed dramatically. Application designs can make different optimizations and trade offs to take advantage of these resources.
* New Computing Environments. The infrastructure requirements for applications can easily exceed the resources of a single computer, and cloud infrastructure now provides massive, elastic, cost-effective computing capacity on a metered cost model.
* Operational Simplicity. Digital transformation in the enterprise drives the deployment of more technology on more infrastructure. Being able to automate day-to-day systems management is key to run applications efficiently at scale.

__MongoDB Data Model__

MongoDB stores data as documents in a binary representation called BSON (Binary JSON). The BSON encoding extends the popular JSON (JavaScript Object Notation) representation to include additional types such as int, long, and floating point. BSON documents contain one or more fields, and each field contains a value of a specific data type, including arrays, binary data and sub-documents.

Documents that tend to share a similar structure are organized as collections. It may be helpful to think of collections as being analogous to a table in a relational database: documents are similar to rows, and fields are similar to columns.

__MongoDB Query Model__

Unlike other so-called NoSQL databases, MongoDB is not limited to simple Key-Value operations. Developers can build rich applications using complex queries and secondary indexes that unlock the value in structured, semi-structured and unstructured data.

A key element of this flexibility is MongoDB's support for many types of queries. A query may return a document, a subset of specific fields within the document or complex aggregations against many documents:

* __Key-value queries__ return results based on any field in the document, often the primary key.
* __Range queries__ return results based on values defined as inequalities (e.g, greater than, less than or equal to, between).
* __Geospatial queries__ return results based on proximity criteria, intersection and inclusion as specified by a point, line, circle or polygon.
* __Text Search queries__ return results in relevance order based on text arguments using Boolean operators (e.g., AND, OR, NOT).
* __Aggregation Framework queries__ return aggregations of values returned by the query (e.g., count, min, max, average, similar to a SQL GROUP BY statement).
* __MapReduce queries__ execute complex data processing that is expressed in JavaScript and executed across data in the database.

__Indexing__

Indexes are a crucial mechanism for optimizing system performance and scalability while providing flexible access to the data. Like most database management systems, while indexes will improve the performance of some operations by orders of magnitude, they incur associated overhead in write operations, disk usage, and memory consumption. By default, the WiredTiger storage engine compresses indexes in RAM, freeing up more of the working set for documents.

MongoDB includes support for many types of secondary indexes that can be declared on any field in the document, including fields within arrays:

* Unique Indexes.
* Compound Indexes.
* Array Indexes.
* TTL Indexes.
* Geospatial Indexes.
* Sparse Indexes.
* Text Search Indexes.

If you want to learn further information about [MongoDB Architecture Guide](http://www.mongodb.com/lp/white-paper/architecture-guide), you can download it white paper.

### Using MongoDB

First of all, open [MongoDB Manual](http://docs.mongodb.org/manual/), it'll be handy.

Then, read [Setting Up MongoDB](https://docs.c9.io/v1.0/docs/setting-up-mongodb) and how to [setup a database](https://docs.c9.io/v1.0/docs/setup-a-database) on cloud9.

MongoDB is preinstalled in your workspace. To run MongoDB, run the following below (passing the correct parameters to it). Mongodb data will be stored in the folder `data`.

```
mkdir data
echo 'mongod --bind_ip=$IP --dbpath=data --nojournal --rest "$@"' > mongod
chmod a+x mongod
```

You can start `mongodb` by running the mongod script on your project root:

```
./mongod
```

Now you can open the _mongo shell_ in a new Terminal, running following command:

```
mongo
```

After starting the mongo shell, your session will use the test database by default. At any time, issue the following operation at the mongo shell to report the name of the current database:

```
>db
test
```

From the mongo shell, display the list of databases, with the following operation: `show dbs`.

Switch to a new database named mydb, with the following operation: `use mydb`.

MongoDB will not permanently create a database until you insert data into that database.

__Create a Collection and insert Documents__

```
// Create two documents named j and k by using the following sequence of JavaScript operations:
j = { name : "mongo" }
k = { x : 3 }

// Insert the j and k documents into the testData collection with the following sequence of operations:
db.testData.insert( j )
db.testData.insert( k )

// Confirm that the testData collection exists. Issue the following operation:
show collections

// Confirm that the documents exist in the testData collection by issuing a query on the collection using the find() method:
db.testData.find()
```

__Further practice__

[Insert Documents using a For Loop or a JavaScript Function](http://docs.mongodb.org/manual/tutorial/getting-started/#insert-documents-using-a-for-loop-or-a-javascript-function).

[Query for specific documents](http://docs.mongodb.org/manual/tutorial/getting-started/#query-for-specific-documents).

__MongoDB Basic Operations__

* `.insert()`
* `.find()`
* `.limit()`
* `.sort()`
* `.remove()`
* `.drop()`
* `.update()`

Also, read the [Query and Projection Operators](http://docs.mongodb.org/manual/reference/operator/query/) list.



### Integrating MongoDB with our express application

Now we can integrate [MongoDB Node.js driver](https://github.com/mongodb/node-mongodb-native) or [Mongoose](http://mongoosejs.com/) in our express application.

Mongoose is a MongoDB object modeling tool designed to work in an asynchronous environment.

```
npm install --save mongoose
```

Take a look at `examples/mongoose/` for code explanation.

---

### [Geospatial Indexes and Queries](http://docs.mongodb.org/manual/applications/geospatial-indexes/)

Geospatial Indexes in MongoDB can be classified according to the version of the MongoDB API used, as with version 2.4 [2dsphere indexes](http://docs.mongodb.org/manual/core/2dsphere/) where introduced, previously we could only use [2d indexes](http://docs.mongodb.org/manual/core/2d/).

Here's an example using `mongoose` with `2dsphere` indexes:

```
// routes/newParking.js
var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

router.get('/', function(req, res, next) {
    var Parking = new Schema({
        name: {
            type: String,
            default: 'Without name'
        },
        location: {
            'type': {
                type: String, 
                enum: ['Point', 'LineString', 'Polygon'], 
                default: 'Point'
            }, 
            coordinates: {
                type: [Number],
                default: [0, 0]}
            }
    });
    
    Parking.index({location: '2dsphere'});
    
    mongoose.model('Parking', Parking, {collection: 'parkings'});
    mongoose.connect('mongodb://0.0.0.0:27017/mydb');
        
    var db = mongoose.connection,
        oData = {
            result: 'conexion ok'
        },
        oParking = db.model('Parking');
    
    db.on('error', console.error.bind(console, 'connection error:'));
    db.once('open', function (callback) {
        oParking.create({
            name: req.body.name,
            location: {
                type: 'Point',
                coordinates: [req.body.lat, req.body.long]
            }
            }, function (poError) {
                if (poError) {
                    throw poError;
                }
                console.log('creation ok');
                
                oParking.find({
                        location: {
                            $near: {
                                type: 'Point',
                                coordinates: [req.body.lat, req.body.long]
                            },
                            $maxDistance: 100 / 6371 // See * below
                        }
                    }, function (poError, poDocuments) {
                    if (poError) {
                        throw poError;
                    }
                    
                    oData.rows = poDocuments;
                    db.close();
                    res.render('parkings', oData);
                });
            });
    });
});

module.exports = router;
```

__(*) Be careful__ when calculating distances with query operators, read [Calculate Distance Using Spherical Geometry](http://docs.mongodb.org/manual/tutorial/calculate-distances-using-spherical-geometry-with-2d-geospatial-indexes/) in order to learn about calculating distance in radians.

### Model relationships and population

There're some patterns that we should follow when creating our databse structure:

* [Model Embedded One-to-One Relationships with Embedded Documents](http://docs.mongodb.org/manual/tutorial/model-embedded-one-to-one-relationships-between-documents/).
* [Model Embedded One-to-Many Relationships with Embedded Documents](http://docs.mongodb.org/manual/tutorial/model-embedded-one-to-many-relationships-between-documents/).
* [Model Embedded One-to-Many Relationships with Document References](http://docs.mongodb.org/manual/tutorial/model-referenced-one-to-many-relationships-between-documents/).

There are no joins in MongoDB but sometimes we still want references to documents in other collections. This is where mongoose [population](http://mongoosejs.com/docs/populate.html) comes in.

Population is the process of automatically replacing the specified paths in the document with document(s) from other collection(s). We may populate a single document, multiple documents, plain object, multiple plain objects, or all objects returned from a query. Let's look at some examples.

```
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;
  
var personSchema = Schema({
  _id     : Number,
  name    : String,
  age     : Number,
  stories : [{ type: Schema.Types.ObjectId, ref: 'Story' }]
});

var storySchema = Schema({
  _creator : { type: Number, ref: 'Person' },
  title    : String,
  fans     : [{ type: Number, ref: 'Person' }]
});

var Story  = mongoose.model('Story', storySchema);
var Person = mongoose.model('Person', personSchema);
```

So far we've created two Models. Our Person model has it's stories field set to an array of ObjectIds. The ref option is what tells Mongoose which model to use during population, in our case the Story model. All _ids we store here must be document _ids from the Story model. We also declared the Story _creator property as a Number, the same type as the _id used in the personSchema. It is important to match the type of _id to the type of ref.

Saving refs to other documents works the same way you normally save properties, just assign the _id value:

```
var aaron = new Person({ _id: 0, name: 'Aaron', age: 100 });

aaron.save(function (err) {
  if (err) return handleError(err);
  
  var story1 = new Story({
    title: "Once upon a timex.",
    _creator: aaron._id    // assign the _id from the person
  });
  
  story1.save(function (err) {
    if (err) return handleError(err);
    // thats it!
  });
})
```

So far we haven't done anything much different. We've merely created a Person and a Story. Now let's take a look at populating our story's _creator using the query builder:

```
Story
.findOne({ title: 'Once upon a timex.' })
.populate('_creator')
.exec(function (err, story) {
  if (err) return handleError(err);
  console.log('The creator is %s', story._creator.name);
  // prints "The creator is Aaron"
})
```

Populated paths are no longer set to their original _id , their value is replaced with the mongoose document returned from the database by performing a separate query before returning the results.

Arrays of refs work the same way. Just call the populate method on the query and an array of documents will be returned in place of the original _ids.

## [Socket.io](http://socket.io/docs/) introduction

Server Installation: `npm install socket.io`.

Client download is not necessary, [take a look here to know why](http://socket.io/download/).

Creating a basic server with `express` and `socket.io`:

```
// server.js
var app = require('express').createServer();
var io = require('socket.io')(app);

app.listen(80);

app.get('/', function (req, res) {
  res.sendfile(__dirname + '/index.html');
});

io.on('connection', function (socket) {
  socket.emit('news', { hello: 'world' });
  socket.on('my other event', function (data) {
    console.log(data);
  });
});

<!-- index.html -->
<script src="/socket.io/socket.io.js"></script>
<script>
  var socket = io.connect('http://localhost');
  socket.on('news', function (data) {
    console.log(data);
    socket.emit('my other event', { my: 'data' });
  });
</script>
```

Take a look at `examples/socketio-chat` for further code explanation.

---

### Socket.io & Angular.js Practice

We'll use this tutorial: [Using Node.js and Websockets to Build a Chat Service](http://code.tutsplus.com/tutorials/using-nodejs-and-websockets-to-build-a-chat-service--net-34482) to understand Socket.io basics.

Within c9.io, you can create a new node.js project for code reference, it'll be bootstraped with Socket.io, Angular.js and Bootstrap.

First of all, create your c9 node.js project and let's see how Socket.io interacts with Angular.js.

In practice #14 we'll replicate our express application, but now we'll use Socket.io & Angular.js.

__[Server practice](http://socket.io/docs/server-api/)__

With Socket.io, you can assign different [rooms](http://socket.io/docs/server-api/#socket#join(name:string[,-fn:function]):socket) to each socket, use this functionality in your practice. You can also [emit events to single rooms](http://socket.io/docs/server-api/#socket#to(room:string):socket), instead to a single socket or broadcast them.

Finally, you can access each connected [client's navigator information](http://socket.io/docs/server-api/#client#request), use it to handle your messages and client accordingly.

__[Client practice](http://socket.io/docs/client-api/)__

Although Socket.IO exposes an io variable on the window, it's better to encapsulate it in AngularJS's Dependency Injection system.

```
app.factory('socket', function ($rootScope) {
  var socket = io.connect();
  return {
    on: function (eventName, callback) {
      socket.on(eventName, function () {  
        var args = arguments;
        $rootScope.$apply(function () {
          callback.apply(socket, args);
        });
      });
    },
    emit: function (eventName, data, callback) {
      socket.emit(eventName, data, function () {
        var args = arguments;
        $rootScope.$apply(function () {
          if (callback) {
            callback.apply(socket, args);
          }
        });
      })
    }
  };
});
```

Let's review this [HTML5 Rocks article about AngularJS and Socket.io](http://www.html5rocks.com/en/tutorials/frameworks/angular-websockets/) to learn more about them working together.

And finally, take a look at [btford/angular-socket-io](https://github.com/btford/angular-socket-io) project on Github, you'll find it helpful if you want to work with AngularJS and Socket.io.

---

## [Meteor](https://www.meteor.com/)

The "Meteor Platform" is a recommended stack, a standard set of core packages that are designed to work well together. This stack is used by most Meteor developers and is what is taught by books such as [Discover](https://www.discovermeteor.com/) Meteor. It's a great choice for a wide variety of apps.

If you want to install `Meteor` on Linux or OS X, just release this from your terminal:

```
curl https://install.meteor.com/ | sh
```

There's also [an official installer for Windows](https://install.meteor.com/windows) if you need it.

Go to your c9 dashboard and create a new project, choose `Meteor` to see the bootstraped project.

We'll follow the [official tutorial](https://www.meteor.com/try/) for our practice.

Here you've a link to the [Meteor Documentation](http://docs.meteor.com/), read carefully about `Command Line Tool` and `File Structure`.

Remember that you can [deploy your Meteor app as a mobile app](http://docs.meteor.com/#/basic/buildingmobileapps) with its built-in methods.

---

## Other Node.js Frameworks

* [StrongLoop](https://strongloop.com/).
* [Loopback](http://loopback.io/).
* [Kraken](http://krakenjs.com/).

---

## Karma

[Karma]((http://karma-runner.github.io/) is a JavaScript command line tool that can be used to spawn a web server which loads your application's source code and executes your tests. You can configure Karma to run against a number of browsers, which is useful for being confident that your application works on all browsers you need to support. Karma is executed on the command line and will display the results of your tests on the command line once they have run in the browser.

Karma is a NodeJS application, and should be installed through npm. Full installation instructions are available on the [Karma website](http://karma-runner.github.io/0.12/intro/installation.html).

## Jasmine

[Jasmine](http://jasmine.github.io/1.3/introduction.html) is a behavior driven development framework for JavaScript that has become the most popular choice for testing Angular applications. Jasmine provides functions to help with structuring your tests and also making assertions. As your tests grow, keeping them well structured and documented is vital, and Jasmine helps achieve this.

In Jasmine we use the describe function to group our tests together:

```
describe("sorting the list of users", function() {
  // individual tests go here
});
```

Grouping related tests within describe blocks and describing each individual test within an it call keeps your tests self documenting.

Finally, Jasmine provides matchers which let you make assertions:

```
describe('sorting the list of users', function() {
  it('sorts in descending order by default', function() {
    var users = ['jack', 'igor', 'jeff'];
    var sorted = sortUsers(users);
    expect(sorted).toEqual(['jeff', 'jack', 'igor']);
  });
});
```

Jasmine comes with a number of matchers that help you make a variety of assertions. You should [read the Jasmine documentation](http://jasmine.github.io/1.3/introduction.html#section-Matchers) to see what they are. To use Jasmine with Karma, we use the [karma-jasmine](https://github.com/karma-runner/karma-jasmine) test runner.

---