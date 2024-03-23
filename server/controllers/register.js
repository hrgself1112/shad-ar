const { ObjectId } = require('mongodb');
const express = require("express")
const router = express.Router()
const path  = require("path")
const fs  = require("fs")
const archiver = require("archiver")
const beautify = require('js-beautify').html;


const ejs = require('ejs');
const ArticleRegistrationsModel = require("../models/register");
let { getCurrentFormattedNumberDate, getCurrentFormattedDate, getCurrentFormattedTime, getamOrpm } = require('../misc/date');

const GetRegisterArticle = async (req, res) => {
    const users = await ArticleRegistrationsModel.find()
    res.json(users);
}

const GetRegisterArticlelast = async (req, res) => {
  try {
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);
    
    const endOfDay = new Date(currentDate);
    endOfDay.setHours(23, 59, 59, 999);
    
    const query = {
      createdAt: { $gte: currentDate, $lte: endOfDay } // Update this line with the actual field name
    };

    const result = await ArticleRegistrationsModel.find(query);
    // console.log("Found Articles:", result);
    res.json(result);
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ error: 'Error fetching data' });
  }
};


const GetRegisterArticlebyID = async (req, res) => {
    // console.log(req.params.id)
    try {
        const user = await ArticleRegistrationsModel.find({ _id: { $in: req.params.id.split(",") } });
        if (user) {
            res.json(user);
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

const PostArticleRegister = async (req, res) => {

  const ResLineOne = `<% Response.Charset="utf-8" %>`
  const Ressession = `<% session("topmenulink")="horoscope" %>`
  
    try {
      const { title, description, keywords, url, h1, content, imageurl, imagealt, path, faq, faqlasttext, if_not_lang, processedContentNAMP, processedContentAMP, processedFaqNAMP, processedFaqAMP, AuthorProfile, schemaProfile } = req.body
      

      console.log(imageurl)
      const array1 = schemaProfile.path.split(",").map(item => item.trim())
      const array2 = schemaProfile.text.split(",").map(item => item.trim())
      
      const  imgurlbase =    imageurl == "" ? `https://www.astrosage.com/2024/images/rashifal-2024.jpg` :`https://www.astrosage.com/${array1.join("/")}/images/${imageurl}`
      const generateBreadcrumbHTML = (array1, array2, title) => {
          const resultHTML = [];
          const className = 'BreadCrumb';
      
          for (let i = 0; i < array2.length; i++) {
              const href = i === 0 ? '/' : `/${array1.slice(0, i).join('/')}`;
              const currentTitle = array2[i];
      
              resultHTML.push(`<a href="${href}" title="${currentTitle}" class="${className}">${currentTitle}</a> ${i < array2.length ? `&#187;` : ''}`);
          }
      
          // Add the title breadcrumb without '&#187;' at the end
          resultHTML.push(`<a href="#" title="${title}" class="${className}">${title}</a>`);
      
          return resultHTML.join(' ');
      };
      

      const breadcrumbList = {
        "@context": "https://schema.org/",
        "@type": "BreadcrumbList",
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": array2[0],
            "item": "https://www.astrosage.com"
          },
          ...array2.slice(1).map((name, index) => ({
            "@type": "ListItem",
            "position": index + 2,
            "name": name,
            "item": `https://www.astrosage.com/${array1.slice(0, index + 1).join('/')}`
          })),
          {
            "@type": "ListItem",
            "position": array2.length + 1,
            "name": title,
            "item": `https://www.astrosage.com/${array1.join('/')}/${url}`
          }
        ]
      };

      const jsonLdScript = `<script type="application/ld+json">${JSON.stringify(breadcrumbList)}</script>`;

      const breadcrumbHTML = generateBreadcrumbHTML(array1, array2, title);
      
      const faqsnonamp = faq.trim() == "" ? "" : processedFaqNAMP 
      const faqsamp = faq.trim() == "" ? "" : processedFaqAMP
      

        const newUser = new ArticleRegistrationsModel({
            title: title,
            description: description,
            keywords: keywords,
            url: url,
            h1: h1,
            content: content,
            imageurl: imageurl,
            imagealt: imagealt,
            path: path,
            faq: faq,
            imgurlpath:imgurlbase,
            faqlasttext: faqlasttext,
            if_not_lang: if_not_lang,
            processedContentNAMP: beautify(processedContentNAMP, { indent_size: 2 }),
            processedContentAMP: beautify(processedContentAMP, { indent_size: 2 }),
            processedFaqNAMP: faqsnonamp,
            processedFaqAMP: faqsamp,
            AuthorProfile: AuthorProfile,
            schemaProfile: schemaProfile,

            ResLineOne:ResLineOne,
            Ressession:Ressession, 
            TimeRanges:{
              getCurrentFormattedNumberDate:getCurrentFormattedNumberDate(),
              getCurrentFormattedDate:getCurrentFormattedDate(),
              getCurrentFormattedTime:getCurrentFormattedTime().three,
              getCurrentFormattedTimetwo:getCurrentFormattedTime().two,
              getamOrpm:getamOrpm()
            },
            BreadCrumbs:breadcrumbHTML,
            newerPath:array1.join("/"),
            jsonLdScript:jsonLdScript,
        });

        // Save the user to the Rdatabase
        await newUser.save();

        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });

    }
}

const DeleteRegisterArticlesByID = async (req, res) => {
    const ids  = req.params.id.split(",")
    // console.log(ids);
    try {
        // Find and remove articles by multiple IDs
        const deletedArticles = await ArticleRegistrationsModel.deleteMany({ _id: { $in: ids } });

        if (!deletedArticles.deletedCount) {
            return res.status(404).json({ error: 'No articles found for the provided IDs' });
        }

        res.json({ message: 'Articles deleted successfully', deletedArticles });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const DownloadRegisterArticlesByID = async (req, res) => {
  try {
    // console.log(req.query.id);

    let ids = req.query.id.split(",");
    const jsonData = await ArticleRegistrationsModel.find({ _id: { $in: ids } });

    const outputDirectory = '/tmp/generatedFiles';
    const outputDirectoryAMP = '/tmp/generatedFiles/amp';

    if (!fs.existsSync(outputDirectory)) {
      fs.mkdirSync(outputDirectory, { recursive: true });
    }

    if (!fs.existsSync(outputDirectoryAMP)) {
      fs.mkdirSync(outputDirectoryAMP, { recursive: true });
    }

    const archive = archiver('zip', {
      zlib: { level: 9 }
    });

    archive.on('error', (err) => {
      res.status(500).send({ error: err.message });
    });

    res.attachment('generatedFiles.zip');
    archive.pipe(res);

    for (let i = 0; i < jsonData.length; i++) {
      const data = jsonData[i];
      // console.log(data);
      const filename = data.url.replace(/[^\w\s.-]/gi, '');

      // Render the EJS template with data
      const renderedHTML = await ejs.renderFile(path.join(__dirname, '../views/creation/template.ejs'), data);
      const renderedHTMLAMP = await ejs.renderFile(path.join(__dirname, '../views/creation/amptemplate.ejs'), data);

      // Write the rendered HTML content to ASP files with the correct extension
      fs.writeFileSync(path.join(outputDirectory, `${filename}.asp`), renderedHTML);
      fs.writeFileSync(path.join(outputDirectoryAMP, `${filename}.asp`), renderedHTMLAMP);

      // Add ASP files to the ZIP archive
      archive.file(path.join(outputDirectory, `${filename}.asp`), { name: `generatedFiles/${filename}` });
      archive.file(path.join(outputDirectoryAMP, `${filename}.asp`), { name: `generatedFiles/amp/${filename}` });
    }

    archive.finalize();
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: 'Internal server error' });
  }
};

  
module.exports = {
    PostArticleRegister, GetRegisterArticlelast, GetRegisterArticle , GetRegisterArticlebyID , DeleteRegisterArticlesByID,DownloadRegisterArticlesByID
}


