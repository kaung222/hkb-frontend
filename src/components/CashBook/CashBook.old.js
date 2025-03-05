import React, { useState, useEffect, useRef } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  ScrollView,
  Dimensions,
} from "react-native";

import { MaterialCommunityIcons, FontAwesome5 } from "@expo/vector-icons";
import axios from "axios";
import { DataTable } from "react-native-paper";
import { Picker } from "@react-native-picker/picker";
import NumberFormat from "react-number-format";

const CashBook = (props) => {
  const [loading, setLoading] = useState(false);
  const [filterDate, setfilterDate] = useState("today");
  const [cash, setCash] = useState([]);
  const [cashDetail, setCashDetail] = useState({});
  const [refresh, setRefresh] = useState(false);
  const [addCash, setAddCash] = useState(false);
  const [debtDetail, setDebtDetail] = useState({});
  const [creditList, setCreditList] = useState(false);
  const [debt, setDebt] = useState([]);
  const [sortByItem, setSortByItem] = useState("date");

  const [branch, setBranch] = useState("all");

  const [editableGE, setEditableGE] = useState(false);
  const [editableAdj, setEditableAdj] = useState(false);

  const refGE = useRef();
  const refadj = useRef();
  const shop = props.shop;
  const user = props.user;

  const getCash = async () => {
    await axios
      .post("https://service-manager.hlakabar.com/api/hkb.php?op=getcash", {
        filterDate: filterDate ? filterDate : "today",
      })
      .then(async (res) => {
        let cash = res.data[0].cashBook;
        cash.forEach((obj) => {
          obj.service = +obj.service;
          obj.payyan = +obj.payyan;
          obj.yayan = +obj.yayan;
          obj.sale = +obj.sale;
          obj.purchase = +obj.purchase;
          obj.adjust = +obj.adjust;
          obj.generalExpense = +obj.generalExpense;
        });

        if (branch === "all") {
          setCash(
            cash.sort((a, b) =>
              a[sortByItem].toString().toUpperCase() <
              b[sortByItem].toString().toUpperCase()
                ? 1
                : -1
            )
          );
        } else {
          const result = cash.filter((gg) => gg.branch === branch.toString());
          if (result == undefined) {
            setCash([]);
          } else {
            setCash(
              result.sort((a, b) =>
                a[sortByItem].toUpperCase() < b[sortByItem].toUpperCase()
                  ? 1
                  : -1
              )
            );
          }
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
  function filterIt(arr, searchKey) {
    return arr.filter(function (obj) {
      return Object.keys(obj).some(function (key) {
        return obj[key].toString().toLowerCase().includes(searchKey);
      });
    });
  }
  const getDebt = async () => {
    await axios
      .post("https://service-manager.hlakabar.com/api/hkb.php?op=getDebt", {
        filterDate: filterDate ? filterDate : "today",
      })
      .then(async (res) => {
        let debt = res.data[0].Debt;

        debt.forEach((obj) => {
          obj.payyan = +obj.payyan;
          obj.yayan = +obj.yayan;
        });

        if (branch === "all") {
          setDebt(
            debt.sort((a, b) =>
              a[sortByItem].toString().toUpperCase() <
              b[sortByItem].toString().toUpperCase()
                ? 1
                : -1
            )
          );
        } else {
          const result = debt.filter((gg) => gg.branch === branch.toString());
          if (result == undefined) {
            setDebt([]);
          } else {
            setDebt(
              result.sort((a, b) =>
                a[sortByItem].toUpperCase() < b[sortByItem].toUpperCase()
                  ? 1
                  : -1
              )
            );
          }
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    setCash([]);
    setDebt([]);
    getCash();
    getDebt();
    user != null ? user.branch && setBranch(user.branch) : null;
  }, [filterDate, loading, refresh, branch]);

  const cashFunc = async () => {
    setLoading(true);
    await axios
      .post(
        "https://service-manager.hlakabar.com/api/hkb.php?op=cash",
        cashDetail
      )
      .then(async (res) => {
        console.log(res.data);
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
        console.log(err);
      });
  };

  const debtFunction = async (d) => {
    setLoading(true);
    console.log(d);
    await axios
      .post("https://service-manager.hlakabar.com/api/hkb.php?op=debt", d)
      .then(async (res) => {
        console.log(res.data);
        setLoading(false);
        setDebtDetail({});
      })
      .catch((err) => {
        setLoading(false);
        console.log(err);
        setDebtDetail({});
      });
  };

  return (
    <View style={styles.cash}>
      <View style={styles.header}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <FontAwesome5 name="dollar-sign" size={24} color="#eee" />
          <Text style={styles.headerText}>Cash Book</Text>
          {loading && (
            <ActivityIndicator animating={loading} size="small" color="#fff" />
          )}
          <Picker
            style={styles.input1}
            selectedValue={filterDate}
            onValueChange={(itemValue, itemIndex) => setfilterDate(itemValue)}
          >
            <Picker.Item label="Today" value="today" />
            <Picker.Item label="This Week (sun - sat)" value="tweek" />
            <Picker.Item label="This Month (1 - 28,29,30,31) " value="tmonth" />
            <Picker.Item label="This Year (Jan1 - Dec31) " value="tyear" />
            <Picker.Item label="Last Week (last 7 days)" value="pweek" />
            <Picker.Item label="Last Month (last 30days) " value="pmonth" />
            <Picker.Item label="Last Year (last 365days) " value="pyear" />
            <Picker.Item label="== All Time ==" value="all" />
            <Picker.Item label="January" value="jan" />
            <Picker.Item label="February" value="feb" />
            <Picker.Item label="March" value="mar" />
            <Picker.Item label="April" value="apr" />
            <Picker.Item label="May" value="may" />
            <Picker.Item label="June" value="jun" />
            <Picker.Item label="July" value="jul" />
            <Picker.Item label="August" value="aug" />
            <Picker.Item label="September" value="sep" />
            <Picker.Item label="October" value="oct" />
            <Picker.Item label="November" value="nov" />
            <Picker.Item label="December" value="dec" />
          </Picker>
          <Text
            style={{
              fontWeight: "bold",
              fontSize: 12,
              marginLeft: 20,
              color: "#fff",
            }}
          >
            ဆိုင်ခွဲ{" "}
          </Text>
          <Picker
            style={styles.input1}
            selectedValue={branch}
            onValueChange={(itemValue, itemIndex) => setBranch(itemValue)}
          >
            <Picker.Item label="All Branch" value="all" />
            {shop &&
              shop.map((shop) => {
                return (
                  <Picker.Item
                    key={shop.branch}
                    label={"Branch_" + shop.branch}
                    value={shop.branch}
                  />
                );
              })}
          </Picker>
        </View>
        <TouchableOpacity
          style={styles.btn}
          onPress={() => {
            setCreditList(!creditList);
          }}
        >
          <Text style={{ fontSize: 12, fontWeight: "bold" }}>
            {!creditList ? "အကြွေးစာရင်း" : "ပိတ်ပါ"}
          </Text>
        </TouchableOpacity>
      </View>
      <View style={styles.body}>
        <View style={styles.addItemList}>
          <Text
            style={{
              fontWeight: "bold",
              fontSize: 14,
            }}
          >
            ငွေစာရင်း
          </Text>
          <View
            style={{
              width: "100%",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              marginTop: 5,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <TouchableOpacity
                style={styles.btn1}
                onPress={() => {
                  setAddCash(true);
                }}
              >
                <Text
                  style={{ fontSize: 14, fontWeight: "bold", color: "#fff" }}
                >
                  Add New
                </Text>
              </TouchableOpacity>
              <TextInput
                placeholder="Search Everything"
                style={styles.input1}
                onChangeText={(text) => {
                  text === ""
                    ? setRefresh(!refresh)
                    : setCash(filterIt(cash, text.toLowerCase()));
                }}
              />
              <Text
                style={{ fontWeight: "bold", fontSize: 12, marginLeft: 20 }}
              >
                Sort By{" "}
              </Text>
              <Picker
                style={styles.input1}
                selectedValue={sortByItem}
                onValueChange={(itemValue, itemIndex) =>
                  setSortByItem(itemValue)
                }
              >
                <Picker.Item label="Date" value="date" />
                <Picker.Item label="Sale" value="sale" />
                <Picker.Item label="Purchase" value="purchase" />
                <Picker.Item label="General Expense" value="generalExpense" />
                <Picker.Item label="Adjust" value="adjust" />
              </Picker>
            </View>

            <TouchableOpacity
              onPress={() => {
                setRefresh(!refresh);
              }}
            >
              <MaterialCommunityIcons name="refresh" size={24} color="black" />
            </TouchableOpacity>
          </View>

          <ScrollView
            style={{
              width: "100%",
              flex: 1,
            }}
            showsVerticalScrollIndicator={false}
          >
            {creditList && (
              <DataTable style={{ flex: 1 }}>
                <DataTable.Header
                  style={{
                    backgroundColor: "#6836838f",
                    marginTop: 5,
                    borderBottomColor: "black",
                    borderWidth: 1,
                    borderBottomWidth: 1,
                    borderColor: "black",
                  }}
                >
                  <DataTable.Title style={styles.tableTitle1}>
                    ရက်စွဲ
                  </DataTable.Title>
                  <DataTable.Title
                    style={[styles.tableTitle1, { maxWidth: 50 }]}
                  >
                    ဆိုင်ခွဲ
                  </DataTable.Title>
                  <DataTable.Title style={styles.tableTitle1}>
                    အမည်
                  </DataTable.Title>
                  <DataTable.Title style={styles.tableTitle1}>
                    ဘောက်ချာနံပါတ်
                  </DataTable.Title>
                  <DataTable.Title style={styles.tableTitle1}>
                    အကြောင်းအရာ
                  </DataTable.Title>
                  <DataTable.Title style={styles.tableTitle1}>
                    ပေးရန်ကျန်ငွေ
                  </DataTable.Title>
                  <DataTable.Title
                    style={[styles.tableTitle1, { borderRightWidth: 0 }]}
                  >
                    ရရန်ကျန်ငွေ
                  </DataTable.Title>
                </DataTable.Header>
                {debt &&
                  debt != [] &&
                  debt.map((debt, index) => {
                    return (
                      <DataTable.Row
                        key={debt.id}
                        onPress={() => {
                          setDebtDetail(debt);
                        }}
                        style={{
                          backgroundColor: index % 2 === 0 ? "#fff" : "#dedede",
                        }}
                      >
                        <View style={styles.tableTitle1}>
                          <Text style={styles.dataText} numberOfLines={3}>
                            {debt.date}
                          </Text>
                        </View>
                        <View style={[styles.tableTitle1, { maxWidth: 50 }]}>
                          <Text style={styles.dataText} numberOfLines={3}>
                            {debt.branch}
                          </Text>
                        </View>
                        <View style={styles.tableTitle1}>
                          <Text style={styles.dataText} numberOfLines={3}>
                            {debt.name}
                          </Text>
                        </View>
                        <View style={styles.tableTitle1}>
                          <Text style={styles.dataText} numberOfLines={3}>
                            {debt.voucher}
                          </Text>
                        </View>
                        <View style={styles.tableTitle1}>
                          <Text style={styles.dataText} numberOfLines={3}>
                            {debt.description}
                          </Text>
                        </View>
                        <View style={styles.tableTitle1}>
                          <Text style={styles.dataText} numberOfLines={3}>
                            {debt.payyan}
                          </Text>
                        </View>
                        <View
                          style={[styles.tableTitle1, { borderRightWidth: 0 }]}
                        >
                          <Text style={styles.dataText} numberOfLines={3}>
                            {debt.yayan}
                          </Text>
                        </View>
                      </DataTable.Row>
                    );
                  })}
              </DataTable>
            )}
            {!creditList &&
              cash != [] &&
              cash.map((cash) => {
                return (
                  <View key={cash.gg} style={styles.cashContainer}>
                    <Text style={styles.dateHeader}>{cash.gg}</Text>
                    <View
                      style={{ flexDirection: "row", flex: 1, marginTop: 10 }}
                    >
                      <View
                        style={{
                          flex: 3,
                          borderWidth: 1,
                          borderColor: "gray",
                        }}
                      >
                        <View
                          style={[
                            styles.tableTitle,
                            { backgroundColor: "#6836838f" },
                          ]}
                        >
                          <Text style={[styles.dataText, { fontSize: 18 }]}>
                            Description
                          </Text>
                        </View>

                        <View style={[styles.tableTitle]}>
                          <Text style={styles.dataText}>Service</Text>
                        </View>
                        <View
                          style={[
                            styles.tableTitle,
                            { backgroundColor: "#dedede" },
                          ]}
                        >
                          <Text style={styles.dataText}>Sale</Text>
                        </View>
                        <View style={[styles.tableTitle]}>
                          <Text style={styles.dataText}>Purchase</Text>
                        </View>
                        <View
                          style={[
                            styles.tableTitle,
                            { backgroundColor: "#dedede" },
                          ]}
                        >
                          <Text style={styles.dataText}>အကြွေးပေးငွေ</Text>
                        </View>
                        <View style={[styles.tableTitle]}>
                          <Text style={styles.dataText}>အကြွေးရငွေ</Text>
                        </View>
                        <TouchableOpacity
                          onPress={() => {
                            setCashDetail(cash);
                            setEditableGE(true);
                            refGE.current.focus();
                          }}
                          style={[
                            styles.tableTitle,
                            { backgroundColor: "#dedede" },
                          ]}
                        >
                          <Text style={styles.dataText}>General Expense</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          onPress={() => {
                            setCashDetail(cash);
                            setEditableAdj(true);
                            refadj.current.focus();
                          }}
                          style={[styles.tableTitle]}
                        >
                          <Text style={styles.dataText}>Adjust</Text>
                        </TouchableOpacity>
                      </View>
                      <View
                        style={{
                          flex: 1,
                          borderWidth: 1,
                          borderColor: "gray",
                        }}
                      >
                        <View
                          style={[
                            styles.tableTitle,
                            { backgroundColor: "#6836838f" },
                          ]}
                        >
                          <Text style={[styles.dataText, { fontSize: 18 }]}>
                            Amount
                          </Text>
                        </View>
                        <View style={[styles.tableTitle]}>
                          <Text style={styles.dataText}>
                            <NumberFormat
                              value={cash.service}
                              displayType={"text"}
                              thousandSeparator={true}
                            />
                          </Text>
                        </View>
                        <View
                          style={[
                            styles.tableTitle,
                            { backgroundColor: "#dedede" },
                          ]}
                        >
                          <Text style={styles.dataText}>
                            <NumberFormat
                              value={cash.sale}
                              displayType={"text"}
                              thousandSeparator={true}
                            />
                          </Text>
                        </View>
                        <View style={[styles.tableTitle]}>
                          <Text style={styles.dataText}>
                            <NumberFormat
                              value={cash.purchase}
                              displayType={"text"}
                              thousandSeparator={true}
                            />
                          </Text>
                        </View>
                        <View
                          style={[
                            styles.tableTitle,
                            { backgroundColor: "#dedede" },
                          ]}
                        >
                          <Text style={styles.dataText}>
                            <NumberFormat
                              value={cash.payyan}
                              displayType={"text"}
                              thousandSeparator={true}
                            />
                          </Text>
                        </View>
                        <View style={[styles.tableTitle]}>
                          <Text style={styles.dataText}>
                            <NumberFormat
                              value={cash.yayan}
                              displayType={"text"}
                              thousandSeparator={true}
                            />
                          </Text>
                        </View>
                        <View
                          style={[
                            styles.tableTitle,
                            { backgroundColor: "#dedede" },
                          ]}
                        >
                          <TextInput
                            onKeyPress={(e) => {
                              if (e.key === "Enter") {
                                setEditableGE(false);
                                cashFunc();
                              }
                            }}
                            ref={refGE}
                            style={[styles.dataText, { textAlign: "right" }]}
                            editable={editableGE}
                            defaultValue={cash.generalExpense}
                            onChangeText={(text) => {
                              setCashDetail({
                                ...cashDetail,
                                ge: parseInt(text),
                              });
                            }}
                          />
                          {/* <Text style={styles.dataText}>
                            <NumberFormat
                              value={cash.generalExpense}
                              displayType={"text"}
                              thousandSeparator={true}
                            />
                          </Text> */}
                        </View>
                        <View style={[styles.tableTitle]}>
                          <TextInput
                            onKeyPress={(e) => {
                              if (e.key === "Enter") {
                                setEditableAdj(false);
                                cashFunc();
                              }
                            }}
                            ref={refadj}
                            style={[styles.dataText, { textAlign: "right" }]}
                            editable={editableAdj}
                            defaultValue={cash.adjust}
                            onChangeText={(text) => {
                              setCashDetail({
                                ...cashDetail,
                                adjust: parseInt(text),
                              });
                            }}
                          />

                          {/* <Text style={styles.dataText}>
                            <NumberFormat
                              value={cash.adjust}
                              displayType={"text"}
                              thousandSeparator={true}
                            />
                          </Text> */}
                        </View>
                        <View
                          style={[
                            styles.tableTitle,
                            { backgroundColor: "lightblue" },
                          ]}
                        >
                          <Text style={styles.dataText}>
                            Balance ={" "}
                            <NumberFormat
                              value={
                                cash.service +
                                cash.payyan +
                                cash.yayan +
                                cash.sale +
                                cash.adjust +
                                cash.generalExpense +
                                cash.purchase
                              }
                              displayType={"text"}
                              thousandSeparator={true}
                            />
                          </Text>
                        </View>
                      </View>
                    </View>
                  </View>
                );
              })}
          </ScrollView>

          {(creditList && (
            <View
              style={{
                width: "100%",
                paddingHorizontal: 10,
                paddingVertical: 20,
                flexDirection: "row",
                justifyContent: "space-evenly",
                alignItems: "center",
                backgroundColor: "lightgreen",
              }}
            >
              <Text style={styles.dataText}>
                စုစုပေါင်းပေးရန် ={" "}
                {debt != [] &&
                  debt.reduce((a, b) => {
                    return a + b.payyan;
                  }, 0)}
              </Text>
              <Text style={styles.dataText}>
                စုစုပေါင်းရရန် ={" "}
                {debt != [] &&
                  debt.reduce((a, b) => {
                    return a + b.yayan;
                  }, 0)}
              </Text>
            </View>
          )) || (
            <View
              style={{
                width: "100%",
                paddingHorizontal: 10,
                paddingVertical: 20,
                flexDirection: "row",
                justifyContent: "space-evenly",
                alignItems: "center",
                backgroundColor: "lightgreen",
              }}
            >
              <Text style={styles.dataText}>
                ဆားဗစ်ဝင်ငွေ ={" "}
                {cash != [] &&
                  cash.reduce((a, b) => {
                    return a + b.service;
                  }, 0)}
              </Text>
              <Text style={styles.dataText}>
                စုစုပေါင်းအဝယ် ={" "}
                {cash != [] &&
                  cash.reduce((a, b) => {
                    return a + b.purchase;
                  }, 0)}
              </Text>
              <Text style={styles.dataText}>
                စုစုပေါင်းအရောင်း ={" "}
                {cash != [] &&
                  cash.reduce((a, b) => {
                    return a + b.sale;
                  }, 0)}
              </Text>

              <Text style={styles.dataText}>
                အထွေထွေသုံးငွေ ={" "}
                {cash != [] &&
                  cash.reduce((a, b) => {
                    return a + b.generalExpense;
                  }, 0)}
              </Text>
              <Text style={styles.dataText}>
                Adjust ={" "}
                {cash != [] &&
                  cash.reduce((a, b) => {
                    return a + b.adjust;
                  }, 0)}
              </Text>
              <Text style={styles.dataText}>
                အကြွေးပေးငွေ ={" "}
                {cash != [] &&
                  cash.reduce((a, b) => {
                    return a + b.payyan;
                  }, 0)}
              </Text>
              <Text style={styles.dataText}>
                အကြွေးရငွေ ={" "}
                {cash != [] &&
                  cash.reduce((a, b) => {
                    return a + b.yayan;
                  }, 0)}
              </Text>
            </View>
          )}
        </View>
      </View>
      {debtDetail && debtDetail.id != undefined && (
        <View style={styles.modalView}>
          <TouchableOpacity
            style={{ right: 20, top: 20, position: "absolute" }}
            onPress={() => {
              // setsuccess(false);
              // setError();
              setRefresh(!refresh);
              setDebtDetail({});
            }}
          >
            <MaterialCommunityIcons
              name="close-circle"
              size={24}
              color="#683683"
            />
          </TouchableOpacity>

          <View style={styles.saleModal}>
            <View style={styles.voucherItem}>
              <Text style={styles.dataText}>ရက်စွဲ</Text>
              <Text style={styles.dataText}>{debtDetail.date}</Text>
            </View>
            <View style={styles.voucherItem}>
              <Text style={styles.dataText}>ဆိုင်ခွဲ</Text>
              <Text style={styles.dataText}>{debtDetail.branch}</Text>
            </View>

            <View style={styles.voucherItem}>
              <Text style={styles.dataText}>အမည်</Text>
              <Text style={styles.dataText}>{debtDetail.name}</Text>
            </View>
            <View style={styles.voucherItem}>
              <Text style={styles.dataText}>ဘောက်ချာနံပါတ်</Text>
              <Text style={styles.dataText}>{debtDetail.voucher}</Text>
            </View>
            <View style={styles.voucherItem}>
              <Text style={styles.dataText}>အကြောင်းအရာ</Text>
              <Text style={styles.dataText}>{debtDetail.description}</Text>
            </View>
            <View style={styles.voucherItem}>
              <Text style={styles.dataText}>ပေးရန်ကျန်ငွေ</Text>
              <Text style={styles.dataText}>{debtDetail.payyan}</Text>
            </View>
            <View style={styles.voucherItem}>
              <Text style={styles.dataText}>ရရန်ကျန်ငွေ</Text>
              <Text style={styles.dataText}>{debtDetail.yayan}</Text>
            </View>
            <View style={styles.voucherItem}>
              <Text style={styles.dataText}>ပြန်ဆပ်ငွေ</Text>

              <TextInput
                value={debtDetail.paid ? debtDetail.paid : ""}
                onChangeText={(text) => {
                  setDebtDetail({ ...debtDetail, paid: text });
                }}
                style={[styles.voucherInput]}
                placeholder="ပြန်ဆပ်ငွေ"
              />
            </View>
            <View style={styles.voucherItem}>
              <Text style={styles.dataText}>ဆပ်ပြီးကျန်ငွေ</Text>
              <Text style={styles.dataText}>
                {(debtDetail.payyan != 0 &&
                  (debtDetail.paid
                    ? debtDetail.payyan - parseInt(debtDetail.paid)
                    : debtDetail.payyan - 0)) ||
                  (debtDetail.yayan != 0 &&
                    (debtDetail.paid
                      ? debtDetail.yayan - parseInt(debtDetail.paid)
                      : debtDetail.yayan - 0))}
              </Text>
            </View>
            <View style={styles.innerModalConfirm}>
              <TouchableOpacity
                style={[
                  styles.btn1,
                  { marginHorizontal: 10, backgroundColor: "#fff" },
                ]}
                onPress={() => {
                  setDebtDetail({});
                }}
              >
                <Text
                  style={[
                    styles.dataText,
                    { fontSize: 10, textAlignVertical: "center" },
                  ]}
                >
                  ပိတ်မည်
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.btn1, { marginHorizontal: 10 }]}
                onPress={() => {
                  if (!parseInt(debtDetail.paid)) {
                    alert("No Paid Amount");
                  } else {
                    let d = debtDetail;
                    debtFunction(d);
                  }
                }}
              >
                <Text
                  style={[
                    styles.dataText,
                    { color: "#fff", textAlignVertical: "center" },
                  ]}
                >
                  အကြွေးဆပ်မည်
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
    </View>
  );
};

export default CashBook;

const styles = StyleSheet.create({
  modalView: {
    position: "absolute",
    backgroundColor: "#000000ee",
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  innerModalConfirm: {
    marginTop: 20,
    width: 200,
    height: 75,
    paddingHorizontal: 10,
    position: "relative",
    flexDirection: "row",
    justifyContent: "space-evenly",
    backgroundColor: "#fff",
    alignItems: "center",
    borderRadius: 10,
  },
  voucherItem: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 5,
    padding: 5,
  },
  voucherInput: {
    width: 180,
    paddingVertical: 4,
    paddingHorizontal: 10,
    backgroundColor: "#fff",
    marginLeft: 10,
    borderRadius: 4,
    fontSize: 12,
    textAlign: "right",
    fontWeight: "bold",
  },

  saleModal: {
    paddingVertical: 20,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#6836838f",
    width: 600,
    borderRadius: 10,
    padding: 10,
  },

  cash: {
    width: "100%",
    height: Dimensions.get("window").height - 75,
    alignItems: "center",
  },
  header: {
    borderRadius: 5,
    flexDirection: "row",
    width: "99%",
    alignItems: "center",
    height: 60,
    paddingHorizontal: 20,
    backgroundColor: "#683683",
    justifyContent: "space-between",
  },
  headerText: {
    fontSize: 18,
    fontWeight: "bold",
    marginHorizontal: 10,
    color: "#eee",
  },
  body: {
    width: "100%",
    alignItems: "center",
    marginTop: 10,
    flex: 1,
  },
  btn: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    shadowColor: "#fff",
    shadowOffset: { width: 1, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 3,
    borderRadius: 5,
    backgroundColor: "#fff",
    marginHorizontal: 10,
  },
  btn1: {
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 5,
    shadowColor: "gray",
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 0.8,
    shadowRadius: 5,
    borderRadius: 5,
    backgroundColor: "#683683",
    marginVertical: 10,
  },
  btnText: {
    fontWeight: "bold",
    fontSize: 14,
    color: "#683683",
  },
  addContainer: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    flex: 1,
  },
  addItemList: {
    width: "100%",
    flex: 3,
    padding: 10,
    borderWidth: 1,
    borderColor: "#ababab",
    borderRadius: 5,
    backgroundColor: "#fff",
  },
  addItemDetail: {
    flex: 1,
    padding: 10,
    borderWidth: 1,
    borderColor: "#ababab",
    borderRadius: 5,
    backgroundColor: "#fff",
  },
  input1: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderWidth: 1.5,
    marginLeft: 10,
    borderRadius: 4,
    width: 200,
    fontSize: 12,
  },
  cashContainer: {
    width: "100%",
    padding: 10,
    borderRadius: 5,
    borderColor: "gray",
    borderWidth: 1,
    marginVertical: 10,
  },
  dateHeader: {
    fontSize: 18,
    fontWeight: "bold",
    alignSelf: "flex-end",
  },
  tableTitle: {
    justifyContent: "center",
    alignItems: "flex-end",
    paddingHorizontal: 20,
    paddingVertical: 10,
    height: 35,
  },
  tableTitle1: {
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
    borderRightWidth: 1,
    paddingHorizontal: 5,
    paddingVertical: 10,
  },
  dataText: {
    fontSize: 13,
    fontWeight: "bold",
    textAlign: "center",
    fontWeight: "bold",
    textAlignVertical: "center",
  },
});
