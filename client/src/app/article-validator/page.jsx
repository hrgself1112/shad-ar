"use client"

import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { insertDataForCheck } from '@/redux/slices/article-validator/validate';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import { stringify } from 'postcss';
import React from 'react'
import { useDispatch, useSelector } from 'react-redux';

const cheerio = require("cheerio");

const Page = () => {
  
  const { toast } = useToast()
  
  const dispatch = useDispatch();
  const ArticleValidator = useSelector((state) => state.validateArticle)

  const handleClick = () => {
    
    async function executeCallbacks() {
      // Simulating an asynchronous operation
      await new Promise(resolve => setTimeout(resolve, 0));
      checkHeadingTags(ArticleValidator.content)
      validateMetaTags(ArticleValidator.content.split(/<\/p>\s*<p.*?>/).slice(0, 15).join(""))
    }
    
    
    executeCallbacks();


  }

  const checkHeadingTags = (htmlContent) => {
    const $ = cheerio.load(htmlContent);

    const prohibitedTags = $('h3, h4, h5, h6');

    if (prohibitedTags.length > 0) {
        const errorLines = prohibitedTags.map((index, element) => {
            const rawElement = $(element).get(0);
            console.log('Raw element:', rawElement);
            const lineNumber = $.root().find('*').index(rawElement) + 1;
        }).get();
        
        toast ({
            title: "Error Document contains prohibited heading tags",
            description: `${prohibitedTags}`,
        })
    } else {
        toast ({
            title: "Wohoo🥳🥳",
            description: "Everything is Fine",
        })
    }
};
  
const validateMetaTags = (htmlContent) => {

  
  const $ = cheerio.load(htmlContent);
  
  const textContent = $('body').text();
  
  const requiredElements = ['Title:', 'URL:', 'Keywords:', 'Image:', 'Alt:', 'Description:', 'H1:'];
  
  requiredElements.forEach(element => {
    if (!textContent.includes(element)) {
      toast({
        title: `Error: In Meta`,
        description: `Error: '${element}' is missing`,
      }) 
      console.error(`Error: '${element}' is missing.`);
    }
  });
  
  if (requiredElements.every(element => textContent.includes(element))) {
    console.log("All required elements are present.");
  }
  
  
};


  return (
    <>
      <div className='mx-2'>

        <CKEditor

          data={ArticleValidator.content}
          style={{ color: "#000" }}
          editor={ClassicEditor}
          onChange={(event, editor) => {
            const newData = editor.getData();
            dispatch(
              insertDataForCheck({
                ...ArticleValidator,
                content: newData,
              })
            );
          }}
        />

      </div>


      <div className="mx-2 my-2">
        <Button onClick={handleClick}>Validate</Button>

      </div>

    </>
  )
}

export default Page