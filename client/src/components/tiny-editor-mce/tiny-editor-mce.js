"use client";
import React, { useEffect, useRef, useState } from "react";
import { Button } from "../ui/button";
import { useDispatch, useSelector } from "react-redux";
import { updateUser } from "@/redux/slices/article-data";
import { extractFileNamesFromUrls } from "@/function/extractFileName";
import { getTitleAndMeta, utilsCleaner } from "@/function/extractcleandata";
import { FAQS } from "@/app/article/processedFaq";
import { processed_Content,} from "@/app/article/processContent";
import { schemaData } from "@/data/data";
import { useToast } from "@/components/ui/use-toast"
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

const TinyMceEditor = () => {
  const { toast } = useToast()
  const editorRef = useRef(null);
  const dispatch = useDispatch();
  const [localStorages, setdata] = useState("dark");

  useEffect(() => {
    setdata(localStorage.getItem("theme"))
  }, [])
  
  

  const ArticlesData = useSelector((state) => state.ArticlesData);
  
  function getCleanedContent() {
    let sourceCode = ArticlesData.content
    console.log(sourceCode)
    let content = sourceCode
      .replace(/(&nbsp;|&#160;|&amp;)+/g, "")
      .replace(/<p[^>]*dir="ltr"[^>]*>/g, "<p>")
      .replace(/<h2[^>]*dir="ltr"[^>]*>/g, "<h2>")

    return content;
  }

  let [AmpContent, NonAmpContent] = processed_Content();

function finaliseContent (){
  if(getCleanedContent() == ""){
      toast({
        title: "Content Box is Empty",
        description: "Enter Something in box",
      })
  }
  else if(ArticlesData.path == ""){
    toast({
      title: "Select Article Type",
      description: "Enter Something in box",
    })
  
  }
  else if(ArticlesData.AuthorProfile == ""){
    toast({
      title: "Select Auhtor",
      description: "Enter Something in box",
    })

  }
  else{
    setMetaAndDataToRedux()
}

  
  function setMetaAndDataToRedux() {
   

    let [resultObject, cleanedContent] = getTitleAndMeta(getCleanedContent());
    let { Title, Description, Keywords, URL, H1 } = resultObject;
    let [FAQNAMP, FAQAMP] = FAQS(ArticlesData.faq);
  
    let paths  = ArticlesData.AuthorProfile
    let schema = schemaData[paths.uniqueKey]
    
    let {path,text,faqheading} = schema
    
    
    if(schema.lang == false){
    if(ArticlesData.path == "Transits"){
     if(ArticlesData.if_not_lang=="English"){
        path="transits"
        text="Home , Gochar"
        faqheading="Frequently Asked Questions:"
      }
      else if(ArticlesData.if_not_lang=="Hindi"){

        path="gochar"
        text="होम ,  गोचर"
        faqheading="अक्सर पूछे जाने वाले प्रश्न"
      } 
    }
    else if (ArticlesData.path == "2024"){
    if(ArticlesData.if_not_lang=="English"){
        path="2024"
        text="Home , 2024"
        faqheading="Frequently Asked Questions:"
      }
      else if(ArticlesData.if_not_lang=="Hindi"){

        path="2024"
        text="होम ,  2024"
        faqheading="अक्सर पूछे जाने वाले प्रश्न"
      } 
    }
   }
   else if (schema.lang == true){
    if(ArticlesData.path == "2024"){
      let early = text.split(",")[0]
      console.log(early);
      path="2024"
      text = `${early} , 2024`
    }

   }


let obj = {
  path:path,
  text:text,
  faqheading:faqheading
}
    dispatch(
      updateUser({
        ...ArticlesData,
        title: Title,
        description: Description,
        keywords: Keywords,
        url: extractFileNamesFromUrls(URL),
        h1: H1,
        content: utilsCleaner(cleanedContent),

        processedFaqNAMP: FAQNAMP,
        processedFaqAMP: FAQAMP,

        processedContentNAMP: NonAmpContent,
        processedContentAMP: AmpContent,
        schemaProfile: obj,
      })
    );
  }

}


  useEffect(() => {
    dispatch(
      updateUser({
        ...ArticlesData,
        processedContentNAMP: NonAmpContent.join(""),
        processedContentAMP: AmpContent.join(""),
      })
    );

  }, [ArticlesData.content]);

  return (
    <>
    <div className="max-sm:mx-2 mx-2">
    <CKEditor 
data={ArticlesData.content}
    style={{color:"#000"}}
    editor={ClassicEditor}  
    onChange={(event, editor) => {
      const newData = editor.getData();
      dispatch(
        updateUser({
          ...ArticlesData,
          content: newData,
        })
      );
    }}
    
    />
      </div>

      <div className="my-3 mx-2">
      <Button className="lg:w-[14rem] max-sm:w-full" onClick={() => finaliseContent()}>Finalise Content</Button>
      </div>

    </>
  );
};

export default TinyMceEditor;
