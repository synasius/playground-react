======================
Evonove React tutorial
======================

This project provides the React tutorial scaffolding. It's enough that you clone this repository with::

	$ git clone https://gitlab.com/evonove/react-workshop

then initialize your own repository::

	$ git rm -rf .git/
	$ git init
	$ git commit -am 'initial commit'

Getting started
---------------

The tutorial is distributed with the following structure::

	.
	├── README.rst
	└── client
    	├── index.html
    	└── js
        	└── blog.js

During the workshop, you will update the ``index.html`` and the ``blog.js`` files. Everything else
is already provided through a CDN, so no builders or bundlers are required.

Launching the server
~~~~~~~~~~~~~~~~~~~~

There is no a built-in server so the fastest way to launch your React application is using ``python``.
From the ``client/`` folder, simply::

	$ python2 -m SimpleHTTPServer  # Python 2

or::

	$ python3 -m http.server  # Python 3

You can open your front end application at the `http://localhost:8000`_ URL.

Happy **coding**!

.. _http://localhost:8000: http://localhost:8000

What we're doing
----------------

Build an oversimplified blog in which users can post messages with the following features:

* Create a view that shows all comments
* Create a form to submit a comment
* Provide hooks to add your custom backend
* The user interface should follow an optimistic commenting (show results before they're saved)
* Live updates (add users comments in real-time)
* Support Markdown formatting

Use a fake backend
------------------

We're providing a fully working *fake* backend that you can use to store and retrieve posts. Be aware that
the backend is reset after a period of inactivity. You can find the REST API at the following URL:

``https://evonove-react.herokuapp.com/``