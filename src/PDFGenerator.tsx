
import React, {useState} from "react";
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import './PDFGenerator.css';

declare const manywho: any;

export default class PDFGenerator extends React.Component<any,any> {
    
    
    constructor(props: any) {
        super(props);
        this.printPage = this.printPage.bind(this);
        this.toDataUri = this.toDataUri.bind(this);
    }


    async toDataUri(blob: any) : Promise<string> {
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.readAsDataURL(blob); 
            reader.onloadend = function() {
              const base64data: string = reader.result as string;   
              resolve(base64data);
            }
          });
    }

    async printPage() {
        let comp = manywho.model.getComponent(this.props.id,this.props.flowKey);
        let selector: string = comp.attributes["SelectorClass"];
        let src: any;
        if(selector) {
            src=document.getElementsByClassName(selector)[0];
        }
        else {
            src=document.body;
        }
        //window.print();
        //let paper = document.getElementsByClassName("sum-paper")[0];
        let divs : HTMLCollectionOf<HTMLDivElement> = src.getElementsByTagName("div");

        for(let pos = 0 ; pos < divs.length ; pos++){
            let div:  HTMLDivElement = divs[pos];  
            if(div.style.backgroundImage != '') {
                let url: string = div.style.backgroundImage.replace("url(\"","").replace("\")","");
                console.log(url);
                let data = await fetch(url);
                let blob = await data.blob();
                let dataUri : string = await this.toDataUri(blob);
                div.style.backgroundImage="url(\"" + dataUri + "\")";
            }
        };

        let canvas = await html2canvas(src as HTMLElement,{allowTaint: false});
        let imageData = canvas.toDataURL('image/png');

        let pageWidth = 210; 
        let pageHeight = 295;  
        let imgHeight = canvas.height * (pageWidth / canvas.width); //scaled based onactual width vs page width
        //let heightLeft = imgHeight;

        let doc = new jsPDF({
            orientation: "portrait",
            unit: "mm",
            format: "a4",
        }); 


        ; // current pos vertically in the image
        let page = 0; //current page

        //doc.addImage(imageData, 'PNG', 0, position, imgWidth, imgHeight);
        //heightLeft -= pageHeight;

        let position = 10;
        let heightLeft = imgHeight;
        while (imgHeight - (page  * pageHeight) > 0) {
            if(page > 0) {
                doc.addPage();
            }
            
            let offset = -(pageHeight * page);
            doc = doc.addImage(imageData, 'PNG', 0, offset, pageWidth, imgHeight);
            page++;
            
            position += heightLeft - imgHeight;
            
        }

        //doc.output('datauri');
        doc.save( 'file.pdf');
    }
    
    render() {
        return(
            <div
                className="pdfg"
            >
                <span
                    className="glyphicon glyphicon-print pdfg-icon" 
                    onClick={this.printPage}
                />
            </div>
        );
    }
}

manywho.component.register('PDFGenerator', PDFGenerator);