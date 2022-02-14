# Welcome to Auto Skelly!

This is a small and easy-to-use library built to help you easily 'skellify' your objects with a few easy shapes.

![AutoSkelly Demo Header](/images/demo_header.png)

## Why use AutoSkelly?
It is well known that load time of on-screen content is an important part of user satisfaction. However, if the on-page content is complex and 'heavy' (lots of images for example), load times can take over a second. To help improve the user experience, the concept of 'skeletoning' was created. Essentially, a placeholder view of the relevant content is created which is loaded quickly and replaced dynamically as soon as the actual content becomes available. Examples of this in the real-world are sites like YouTube, which rely heavily on skeletons when loading image-heavy pages.

## Getting Started
Getting your page skelified is super simple! 

Start off by cloning this repo somewhere as you will need the core autoskelly scripts. You will need the `autoskelly.js` file, the `autoskelly.css` file and minified `jQuery`. Place the autoskelly files in the root directory of your project and then call the js file from the bottom of your body section of your index.html as shown below.

```
<body>
  
   <!-- YOUR CODE HERE -->
  
	<script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
    <script type="text/javascript" src="./autoskelly.js"></script>
</body>
```

Next, check out full usage documentation on the official guide [here](https://autoskelly.alexgordienko.com). Enjoy!