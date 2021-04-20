
import React, {CSSProperties, useState} from "react";
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

    async getImage(url: string) : Promise<Blob> {
        return new Promise((resolve) => {
            /*
            var img = new Image();
            //document.appendChild(img);
            img.crossOrigin = 'Anonymous';
            img.onload = function(){
                let canvas: any = document.createElement('CANVAS'),
                ctx = canvas.getContext('2d'), dataURL;
                canvas.height = img.height;
                canvas.width = img.width;
                ctx.drawImage(img, 0, 0);
                dataURL = canvas.toDataURL();
                canvas = null; 
                resolve(dataURL);
            };
            img.src = url;
            */
            var xhr = new XMLHttpRequest();
            xhr.responseType = "blob";
            xhr.open("GET",url);
            xhr.onload = function() {
                const blob: Blob = xhr.response;   
                resolve(blob);
              }
            xhr.send();
            
        });
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


                
                //let blob = await this.getImage(url);
                //let dataUri : string = await this.toDataUri(blob);
                //div.style.backgroundImage="url(\"" + dataUri + "\")";
            }
        };

        let canvas = await html2canvas(src as HTMLElement,{allowTaint: false});
        let imageData = canvas.toDataURL('image/png');

        let pageWidth = 210; 
        let pageHeight = 295;  
        let imgHeight = canvas.height * (pageWidth / canvas.width); //scaled based onactual width vs page width

        pageHeight = imgHeight;
        //let heightLeft = imgHeight;

        let doc = new jsPDF({
            orientation: "portrait",
            unit: "mm",
            format: [pageWidth,pageHeight] //"a4",
            
        }); 

        doc = doc.addImage(imageData, 'PNG', 0, 0, pageWidth, imgHeight);

        /*
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
*/
        //doc.output('datauri');
        doc.save( 'file.pdf');
    }
    
    render() {
        let comp = manywho.model.getComponent(this.props.id,this.props.flowKey);
        let classes: string = "pdfg " + (comp.attributes["classes"]? comp.attributes["classes"] : "");
        

        let icon: any;
        let label: any;

        if(comp.attributes["display"]) {
            if(comp.attributes["display"].indexOf("icon") >= 0) {
                let iconclass: string = "pdfg-icon glyphicon glyphicon-" + (comp.attributes["icon"]? comp.attributes["icon"] : "print");
                icon = (
                    <span className = {iconclass}/>
                );
            }
            if(comp.attributes["display"].indexOf("text") >= 0) {
                label = (
                    <span 
                        className="pdfg-label"
                    >
                        {comp.label}
                    </span>
                );
            }
        }
        else {
            label = (
                <span 
                    className="pdfg-label"
                >
                    {comp.label}
                </span>
            );
        }




        let style: CSSProperties = {};
        if(comp.isVisible === false) {
            style.display = "none";
        }
        if(comp.width) {
            style.width=comp.width + "px"
        }
        if(comp.height) {
            style.height=comp.height + "px"
        }
        return(
            <div
                className={classes}
                style={style}
            >
                <div
                    className="pdfg-button"
                    onClick={this.printPage}
                >
                    {icon}
                    {label}
                </div>
            </div>
        );
    }
}

manywho.component.register('PDFGenerator', PDFGenerator);