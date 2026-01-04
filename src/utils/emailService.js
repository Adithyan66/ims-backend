import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT) || 587,
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });
};

export const sendSalesReportEmail = async (email, salesData) => {
  try {
    const transporter = createTransporter();

    const htmlTable = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; }
          table { border-collapse: collapse; width: 100%; margin: 20px 0; }
          th, td { border: 1px solid #ddd; padding: 12px; text-align: left; }
          th { background-color: #4CAF50; color: white; }
          tr:nth-child(even) { background-color: #f2f2f2; }
          .header { background-color: #4CAF50; color: white; padding: 20px; text-align: center; }
          .total { font-weight: bold; font-size: 18px; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>Sales Report</h1>
          <p>Generated on ${new Date().toLocaleString()}</p>
        </div>
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Item</th>
              <th>Quantity</th>
              <th>Price</th>
              <th>Total Amount</th>
              <th>Customer</th>
              <th>Payment Type</th>
            </tr>
          </thead>
          <tbody>
            ${salesData.map(sale => `
              <tr>
                <td>${new Date(sale.date).toLocaleDateString()}</td>
                <td>${sale.itemId?.name || 'N/A'}</td>
                <td>${sale.quantity}</td>
                <td>₹${sale.itemId?.price || 0}</td>
                <td>₹${sale.totalAmount}</td>
                <td>${sale.isCash ? 'Cash Sale' : (sale.customerId?.name || 'N/A')}</td>
                <td>${sale.isCash ? 'Cash' : 'Customer'}</td>
              </tr>
            `).join('')}
          </tbody>
          <tfoot>
            <tr class="total">
              <td colspan="4">Total Sales</td>
              <td>₹${salesData.reduce((sum, sale) => sum + sale.totalAmount, 0)}</td>
              <td colspan="2">Total Transactions: ${salesData.length}</td>
            </tr>
          </tfoot>
        </table>
      </body>
      </html>
    `;

    const mailOptions = {
      from: process.env.SMTP_USER,
      to: email,
      subject: 'Sales Report - Inventory Management System',
      html: htmlTable
    };

    const info = await transporter.sendMail(mailOptions);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    throw new Error(`Failed to send email: ${error.message}`);
  }
};

