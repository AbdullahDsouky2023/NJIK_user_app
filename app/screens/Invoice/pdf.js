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
  <script src="https://cdn.tailwindcss.com"></script>

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
<body class="p-0" style="background-color: white">

 <div class="flex justify-between">
   <div style="background-color: #f2652a; padding:  1rem; width:  320px; height:  320px; z-index:  10; border-radius:  50%; display: flex; align-items: center; justify-content: center; margin: -60px  0  70px  0; position: relative;">
     <p style="font-weight: bold; font-size:  1.5rem; color: white; border-radius:  0.75rem;">
       فاتورة
     </p>
   </div>
   <div style="background-color: #f2652a; padding:  1rem; width:  150px; height:  150px; display: flex; align-items: center; justify-content: center; margin:  1rem; border-radius:  7.5rem;">
     <img src="https://njik.sa/wp-content/uploads/2019/08/njj-1536x356.png" />
   </div>
 </div>
 


 <div style="display: flex; flex-direction: row; height:  500px; gap:  1rem;">
   <div style="background-color: #a0aec0;
    flex:  2; position: relative; width:  200px; margin-top: -10%;">
     <div style="position: absolute; bottom:  0; padding:  1rem; gap:  1rem;">
       <p style="color: #10b981; text-align: center; font-weight: bold;">
         السياسات  والاحكام
       </p>
       <ul style="list-style-type: disc; margin-inline-start:  0.5rem; font-size:  0.875rem; direction: rtl;">
         <li style="margin-top:  1rem;">
           مدة الضمان  30  يوم  من  تاريخ  اكتمال الطلب  عند الدفع الالكتروني
         </li>
         <li>
           الضمان  يشمل  شغل اليد  فقط
         </li>
         <p style="font-weight: bold; color: #10b981; font-size:  0.875rem;">
           عندك  ملاحظه  او  استفسار ؟
           تسعدنا  خدمتك  علي الرقم  966540860875+
         </p>
       </ul>
     </div>
   </div>

 


   <div style="flex:  5; position: relative;">
     <div style="display: flex; flex-direction: row-reverse; gap:  1rem; padding-left:  0.5rem; margin-top: -70px;">
       <p style="font-weight: bold; font-size:  1rem;">
         الرقم الضريبي
       </p>
       <p style="font-weight: bold; font-size:  1rem;">
         121212312121
       </p>
     </div>
     <div style="display: flex; flex-direction: row-reverse; gap:  1rem; padding:  1rem;">
       <p style="font-weight: bold; font-size:  1rem; color: #a0aec0;">
         الاسم
       </p>
       <p style="font-weight: bold; font-size:  0.875rem; color: #a0aec0;">
         121212312121
       </p>
     </div>
     <div style="display: flex; flex-direction: row-reverse; gap:  1rem; padding:  0.5rem; color: #a0aec0;">
       <p style="font-weight: bold; font-size:  0.875rem;">
         :  رقم الهاتف
       </p>
       <p style="font-weight: bold; font-size:  0.875rem;">
         121212312121
       </p>
     </div>
     <div style="display: flex; flex-direction: row-reverse; justify-content: center; align-items: center; gap:  1rem; width:  100%; padding:  0.5rem;">
       <p style="font-weight: bold; font-size:  1rem;">
         :  رقم الطلب
       </p>
       <p style="font-weight: bold; font-size:  0.875rem; color: #a0aec0;">
         121212312121
       </p>
     </div>
     <div style="background-color: #a0aec0; width:  250px; right:  0; margin-bottom: -80px; position: absolute; bottom:  0; padding:  0.25rem; border-radius:  50%; height:  250px;">
       <p style="font-weight: bold; font-size:  1rem; text-align: center; padding-top:  1rem;">تفاصيل الطلب</p>
       <ul style="padding:  0.75rem;">
         <li style="display: flex; flex-direction: row-reverse; align-items: center; padding-top:  1.25rem; padding-bottom:  0.5rem; padding-left:  0.25rem; padding-right:  0.25rem; gap:  1rem;">
           <p style="font-weight: bold; font-size:  1rem;">
             :الخدمة المطلوبه
           </p>
           <p style="font-weight: bold; font-size:  0.875rem;">
             اجهزة  منزلية
           </p>
         </li>
         <li style="display: flex; flex-direction: row-reverse; align-items: center; padding-top:  0.25rem; padding-bottom:  0.25rem; padding-left:  0.25rem; padding-right:  0.25rem; gap:  1rem;">
           <p style="font-weight: bold; font-size:  1rem;">
             : الفني
           </p>
           <p style="font-weight: bold; font-size:  0.875rem;">
             121212312121
           </p>
         </li>
         <li style="display: flex; flex-direction: row-reverse; align-items: center; padding-top:  0.25rem; padding-bottom:  0.25rem; padding-left:  0.25rem; padding-right:  0.25rem; gap:  1rem;">
           <p style="font-weight: bold; font-size:  1rem;">
             :التاريخ
           </p>
           <p style="font-weight: bold; font-size:  0.875rem;">
             121212312121
           </p>
         </li>
       </ul>
       <div></div>
     </div>
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
