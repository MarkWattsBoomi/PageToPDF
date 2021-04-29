
import React, {CSSProperties, useState} from "react";
import jsPDF from 'jspdf';
import domtoimage from 'dom-to-image';
import './PDFGenerator.css';

declare const manywho: any;

export default class PDFGenerator extends React.Component<any,any> {
    
    printing: boolean = false; 
    constructor(props: any) {
        super(props);
        this.printPage = this.printPage.bind(this);
    }

    shouldComponentUpdate(nextProps: any, nextState: any) {
        return !this.printing;
    }
    

    async printPage() {
        this.printing = true;
        let comp = manywho.model.getComponent(this.props.id,this.props.flowKey);
        let selector: string = comp.attributes["SelectorClass"];
        let src: any;
        if(selector) {
            src=document.getElementsByClassName(selector)[0];
        }
        else {
            src=document.body;
        }
    
        let img = await domtoimage.toPng(src);
        const imgager = new Image();
        imgager.onload = function() {

            let pageWidth = 420; 
            let factor: number = pageWidth / imgager.width; // 10000 / canvas.height ;
            let imageHeight: number = imgager.height * factor;
            let imageWidth: number = imgager.width * factor;

            let doc = new jsPDF({
                orientation: "portrait",
                unit: "px",
                format: [imageWidth,imageHeight] 
            }); 
    
            doc = doc.addImage(img, 'PNG', 0, 0, imageWidth,imageHeight);
    
            doc.save( 'file.pdf');
            
        }
        imgager.src = img;
        
        this.printing = false;
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