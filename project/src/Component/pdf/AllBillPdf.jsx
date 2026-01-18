import { Text, View, StyleSheet } from "@react-pdf/renderer";
import PdfTemplate from "./PdfTemplate";

const styles = StyleSheet.create({
  table: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#0f5c8e",
    marginTop: 12,
  },

  row: {
    flexDirection: "row",
    minHeight: 22,
  },

  headerRow: {
    backgroundColor: "#e6f0f8",
  },

  cell: {
    borderRightWidth: 1,
    borderBottomWidth: 1,
    borderColor: "#0f5c8e",
    paddingVertical: 4,
    paddingHorizontal: 3,
    fontSize: 8,
    lineHeight: 1.3,
    wordBreak: "break-word",
  },

  headerText: {
    fontSize: 8.5,
    fontWeight: "bold",
  },

  // ✅ Better column widths (sum ≈ 100%)
  billNo: { width: "14%" },
  date: { width: "10%", textAlign: "center" },
  customer: { width: "15%" },
  service: { width: "8%" },
  status: { width: "7%" },
  item: { width: "12%" },
  qty: { width: "5%", textAlign: "center" },
  price: { width: "5%", textAlign: "right" },
  subtotal: { width: "8%", textAlign: "right" },
  total: { width: "8%", textAlign: "right" },
  advance: { width: "6%", textAlign: "right" },
  balance: { width: "8%", textAlign: "right" },
});

const Cell = ({ style, children, header }) => (
  <Text style={[styles.cell, style, header && styles.headerText]}>
    {children}
  </Text>
);

const AllBillPdf = ({ filteredBills }) => {
  return (
    <PdfTemplate>
      <View style={styles.table}>

        {/* ===== HEADER ===== */}
        <View style={[styles.row, styles.headerRow]}>
          <Cell style={styles.billNo} header>Bill No</Cell>
          <Cell style={styles.date} header>Date</Cell>
          <Cell style={styles.customer} header>Customer</Cell>
          <Cell style={styles.service} header>Service</Cell>
          <Cell style={styles.status} header>Status</Cell>
          <Cell style={styles.item} header>Item</Cell>
          <Cell style={styles.qty} header>Qty</Cell>
          <Cell style={styles.price} header>Price</Cell>
          <Cell style={styles.subtotal} header>Subtotal</Cell>
          <Cell style={styles.total} header>Total</Cell>
          <Cell style={styles.advance} header>Advance</Cell>
          <Cell style={styles.balance} header>Balance</Cell>
        </View>

        {/* ===== BODY ===== */}
        {filteredBills.map((bill) =>
          bill.items.map((item, index) => (
            <View key={item._id} style={styles.row} wrap>
              {index === 0 ? (
                <>
                  <Cell style={styles.billNo}>{bill.billNumber}</Cell>
                  <Cell style={styles.date}>
                    {new Date(bill.date).toLocaleDateString("en-GB")}
                  </Cell>
                  <Cell style={styles.customer}>{bill.customer}</Cell>
                  <Cell style={styles.service}>{bill.billType}</Cell>
                  <Cell style={styles.status}>{bill.status}</Cell>
                </>
              ) : (
                <>
                  <Cell style={styles.billNo} />
                  <Cell style={styles.date} />
                  <Cell style={styles.customer} />
                  <Cell style={styles.service} />
                  <Cell style={styles.status} />
                </>
              )}

              <Cell style={styles.item}>{item.name}</Cell>
              <Cell style={styles.qty}>{item.qty}</Cell>
              <Cell style={styles.price}>Rs. {item.price}</Cell>
              <Cell style={styles.subtotal}>
                Rs. {(item.qty * item.price).toFixed(2)}
              </Cell>

              {index === 0 ? (
                <>
                  <Cell style={styles.total}>Rs. {bill.total.toFixed(2)}</Cell>
                  <Cell style={styles.advance}>Rs. {bill.advancePayment || 0}</Cell>
                  <Cell style={styles.balance}>
                    Rs. {(bill.total - (bill.advancePayment ?? 0)).toFixed(2)}
                  </Cell>
                </>
              ) : (
                <>
                  <Cell style={styles.total} />
                  <Cell style={styles.advance} />
                  <Cell style={styles.balance} />
                </>
              )}
            </View>
          ))
        )}
      </View>
    </PdfTemplate>
  );
};

export default AllBillPdf;
