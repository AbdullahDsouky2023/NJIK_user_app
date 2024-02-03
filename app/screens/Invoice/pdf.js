// Pdf.js
import React from 'react';
import { View, Button, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import * as Print from 'expo-print';
import { shareAsync } from 'expo-sharing';
import Invoice from './Invoice'; // Import your Invoice component
import { FontAwesome5 } from '@expo/vector-icons';

import { Colors } from '../../constant/styles';
const { height }= Dimensions.get('screen')
export default function Pdf({item}) {
  const printToFile = async () => {
    try {
      let servicesHtml = '';
      item?.attributes?.services?.data?.forEach((service, index) => {
        servicesHtml += `<tr><td>${index+1}</td><td>${service.attributes?.name}</td>
        <td class="right">${service.attributes?.Price>0 ?service.attributes?.Price : "بعد الزيارة"}</td></tr>`;
      });
      const { uri } = await Print.printToFileAsync({
     html:`
     <!doctype html>
     <html class="no-js" lang="">
     
     <head>
       <meta charset="utf-8">
       <title>Invoice Template</title>
       <meta name="viewport" content="width=device-width, initial-scale=1">
     
       <link rel="stylesheet" href="./web/modern-normalize.css">
       <link rel="stylesheet" href="./web/web-base.css">
       <link rel="stylesheet" href="./invoice.css">
       <script type="text/javascript" src="./web/scripts.js"></script>
       <style>
         /*
       The styles here for use when generating a PDF invoice with the HTML code.
     
       * Set up a repeating page counter
       * Place the .footer-info in the last page's footer
     */
     
     .footer {
       margin-top: 30px;
     }
     
     .footer-info {
       float: none;
       position: running(footer);
       margin-top: -25px;
     }
     
     .page-container {
       display: block;
       position: running(pageContainer);
       margin-top: -25px;
       font-size: 12px;
       text-align: right;
       color: #999;
     }
     
     .page-container .page::after {
       content: counter(page);
     }
     
     .page-container .pages::after {
       content: counter(pages);
     }
     
     
     @page {
       @bottom-right {
         content: element(pageContainer);
       }
       @bottom-left {
         content: element(footer);
       }
     }
       </style>
       <style>
         /*
       Common invoice styles. These styles will work in a browser or using the HTML
       to PDF anvil endpoint.
     */
     
     body {
       font-size: 16px;
       
     }
     
     table {
       width: 100%;
       border-collapse: collapse;
     }
     
     table tr td {
       padding: 0;
     }
     
     table tr td:last-child {
       text-align: right;
     }
     
     .bold {
       font-weight: bold;
     }
     
     .right {
       text-align: right;
     }
     
     .large {
       font-size: 1.75em;
     }
     
     .total {
       font-weight: bold;
       color: #fb7578;
     }
     
     .logo-container {
       margin: 20px 0 70px 0;
       background-color:#f2652a;
       padding:20px
     }
     
     .invoice-info-container {
       font-size: 0.875em;
     }
     .invoice-info-container td {
       padding: 4px 0;
     }
     
     .client-name {
       font-size: 1.5em;
       vertical-align: top;
     }
     
     .line-items-container {
       margin: 70px 0;
       font-size: 0.875em;
     }
     
     .line-items-container th {
       text-align: left;
       color: #999;
       border-bottom: 2px solid #ddd;
       padding: 10px 0 15px 0;
       font-size: 0.75em;
       text-transform: uppercase;
     }
     
     .line-items-container th:last-child {
       text-align: right;
     }
     
     .line-items-container td {
       padding: 15px 0;
     }
     
     .line-items-container tbody tr:first-child td {
       padding-top: 25px;
     }
     
     .line-items-container.has-bottom-border tbody tr:last-child td {
       padding-bottom: 25px;
       border-bottom: 2px solid #ddd;
     }
     
     .line-items-container.has-bottom-border {
       margin-bottom: 0;
     }
     
     .line-items-container th.heading-quantity {
       width: 50px;
     }
     .line-items-container th.heading-price {
       text-align: right;
       width: 100px;
     }
     .line-items-container th.heading-subtotal {
       width: 100px;
     }
     
     .payment-info {
       width: 38%;
       font-size: 0.75em;
       line-height: 1.5;
     }
     
     .footer {
       margin-top: 100px;
     }
     
     .footer-thanks {
       font-size: 1.125em;
     }
     
     .footer-thanks img {
       display: inline-block;
       position: relative;
       top: 1px;
       width: 16px;
       margin-right: 4px;
     }
     
     .footer-info {
       float: right;
       margin-top: 5px;
       font-size: 0.75em;
       color: #ccc;
     }
     
     .footer-info span {
       padding: 0 5px;
       color: black;
     }
     
     .footer-info span:last-child {
       padding-right: 0;
     }
     
     .page-container {
       display: none;
     }
       </style>
     </head>
     <body>
     
     <div class="web-container">
     
     <div class="page-container">
     Page
     <span class="page"></span>
     of
     <span class="pages"></span>
     </div>
     
     <div class="logo-container" >
     <img
       style="height: 18px"
       src="https://njik.sa/wp-content/uploads/2019/08/njj-1536x356.png"
     >
     </div>
     
     <table class="invoice-info-container">
     <tr>
       <td rowspan="2" class="client-name">
        ${   item?.attributes?.user?.data?.attributes?.username}
       </td>
       <td>
       </td>
     </tr>
     <tr>
       <td>
       ${   item?.attributes?.location}
       </td>
     </tr>
     <tr>
       <td>
         Invoice Date: <strong>${item?.attributes?.date}</strong>
       </td>
       <td>
       </td>
     </tr>
     <tr>
       <td>
         Invoice No: <strong>       ${   item?.id}
         </strong>
       </td>
       <td>
      fs@njik.sa

       </td>
     </tr>
     </table>
     
     
     <table class="line-items-container">
     <thead>
       <tr>
         <th class="heading-quantity">كمية</th>
         <th class="heading-description">الوصف</th>
         <th class="heading-price">السعر</th>
       </tr>
     </thead>
     <tbody>
     ${
      servicesHtml
     
     }

     </tbody>
     </table>
     
     
     <table class="line-items-container has-bottom-border">
     <thead>
       <tr>
         <th>معلومات الدفع</th>
         <th>التاريخ</th>
         <th>السعر الكلي</th>
       </tr>
     </thead>
     <tbody>
       <tr>
         <td class="payment-info">
           <div>
             Account No: <strong>123567744</strong>
           </div>
           <div>
             Routing No: <strong>120000547</strong>
           </div>
         </td>
         <td class="large">${item?.attributes?.date}</td>
         <td class="large total">${item?.attributes?.totalPrice}</td>
       </tr>
     </tbody>
     </table>
     
     <div class="footer">
     <div class="footer-info">
       <span>fs@njik.sa</span> |
       <span>+966540860875</span> |
       <span>njik.sa</span>
     </div>
     <div class="footer-thanks">
       <img src="https://github.com/anvilco/html-pdf-invoice-template/raw/main/img/heart.png" alt="heart">
       <span>شكرا لك</span>
     </div>
     </div>
     
     </div>
     
     <script type="text/javascript">
       load(document.querySelector('.web-container'), './invoice.html');
     </script>
     
     </body></html>`,
     height:height*1
      });

      console.log('File has been saved to:', uri);

      // Share the generated PDF
      await shareAsync(uri, { UTI: '.pdf', mimeType: 'application/pdf' });
    } catch (error) {
      console.error('Error printing PDF:', error);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
                style={styles.chatContainer}
               onPress={printToFile}
                >
              <FontAwesome5 name="receipt" size={24} color={Colors.whiteColor} />

              </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
  },
  chatContainer:{ 
     paddingHorizontal: 19,
    backgroundColor: Colors.primaryColor,
    width: "auto",
    height: height*0.04,
    borderRadius: 20,
    marginTop:-25,
    left: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",}
});
