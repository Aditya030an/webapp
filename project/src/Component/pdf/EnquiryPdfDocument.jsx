import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
} from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: {
    padding: 24,
    fontSize: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  subTitle: {
    fontSize: 11,
    marginBottom: 6,
  },
  section: {
    marginBottom: 14,
    padding: 10,
    border: "1px solid #d1d5db",
    borderRadius: 4,
  },
  row: {
    marginBottom: 4,
  },
  tableHeader: {
    marginTop: 10,
    marginBottom: 8,
    fontSize: 12,
    fontWeight: "bold",
  },
  enquiryCard: {
    border: "1px solid #d1d5db",
    borderRadius: 4,
    padding: 10,
    marginBottom: 10,
  },
  label: {
    fontWeight: "bold",
  },
});

const EnquiryPdfDocument = ({
  enquiries = [],
  stats = {},
  activeStatus,
  patientStatus,
  searchTerm,
  sortBy,
}) => {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.title}>Enquiry Report</Text>

        <View style={styles.section}>
          <Text style={styles.subTitle}>Summary</Text>
          <Text style={styles.row}>Total Enquiries: {stats?.total || 0}</Text>
          <Text style={styles.row}>Total Leads: {stats?.leads || 0}</Text>
          <Text style={styles.row}>Total Patients: {stats?.patients || 0}</Text>
          <Text style={styles.row}>
            Active Patients: {stats?.activePatients || 0}
          </Text>
          <Text style={styles.row}>
            Inactive Patients: {stats?.inactivePatients || 0}
          </Text>
          <Text style={styles.row}>
            Conversion Rate: {stats?.conversionRate || 0}%
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.subTitle}>Applied Filters</Text>
          <Text style={styles.row}>Enquiry Type: {activeStatus}</Text>
          <Text style={styles.row}>Patient Status: {patientStatus}</Text>
          <Text style={styles.row}>Search Term: {searchTerm || "-"}</Text>
          <Text style={styles.row}>Sort By: {sortBy}</Text>
        </View>

        <Text style={styles.tableHeader}>Enquiry List</Text>

        {enquiries.map((item, index) => (
          <View key={item._id || index} style={styles.enquiryCard}>
            <Text style={styles.row}>
              <Text style={styles.label}>S.No: </Text>
              {index + 1}
            </Text>

            <Text style={styles.row}>
              <Text style={styles.label}>Type: </Text>
              {item?.enquiryStatus || "-"}
            </Text>

            <Text style={styles.row}>
              <Text style={styles.label}>Name: </Text>
              {item?.patientName || "-"}
            </Text>

            <Text style={styles.row}>
              <Text style={styles.label}>Gender: </Text>
              {item?.gender || "-"}
            </Text>

            <Text style={styles.row}>
              <Text style={styles.label}>Age: </Text>
              {item?.age ?? "-"}
            </Text>

            <Text style={styles.row}>
              <Text style={styles.label}>Occupation: </Text>
              {item?.occupation || "-"}
            </Text>

            <Text style={styles.row}>
              <Text style={styles.label}>Contact: </Text>
              {item?.contactNumber || "-"}
            </Text>

            <Text style={styles.row}>
              <Text style={styles.label}>Email: </Text>
              {item?.email || "-"}
            </Text>

            <Text style={styles.row}>
              <Text style={styles.label}>Chief Complaint: </Text>
              {item?.chiefComplaint || "-"}
            </Text>

            <Text style={styles.row}>
              <Text style={styles.label}>Remark: </Text>
              {item?.remark || "-"}
            </Text>

            <Text style={styles.row}>
              <Text style={styles.label}>Response: </Text>
              {item?.response || "-"}
            </Text>

            <Text style={styles.row}>
              <Text style={styles.label}>Source: </Text>
              {item?.source || "-"}
            </Text>

            <Text style={styles.row}>
              <Text style={styles.label}>Patient Code: </Text>
              {item?.patientId?.personalDetails?.patientId || "-"}
            </Text>

            <Text style={styles.row}>
              <Text style={styles.label}>Patient Status: </Text>
              {item?.enquiryStatus === "patient"
                ? item?.patientId?.personalDetails?.patientStatus
                  ? "Active"
                  : "Inactive"
                : "-"}
            </Text>

            <Text style={styles.row}>
              <Text style={styles.label}>Address: </Text>
              {item?.patientId?.personalDetails?.address || "-"}
            </Text>

            <Text style={styles.row}>
              <Text style={styles.label}>Attendance Count: </Text>
              {item?.patientId?.attendance?.length || 0}
            </Text>

            <Text style={styles.row}>
              <Text style={styles.label}>Billing Count: </Text>
              {item?.patientId?.billing?.length || 0}
            </Text>

            <Text style={styles.row}>
              <Text style={styles.label}>Treatment Count: </Text>
              {item?.patientId?.treatment?.length || 0}
            </Text>

            <Text style={styles.row}>
              <Text style={styles.label}>Created At: </Text>
              {item?.createdAt
                ? new Date(item.createdAt).toLocaleString()
                : "-"}
            </Text>
          </View>
        ))}
      </Page>
    </Document>
  );
};

export default EnquiryPdfDocument;