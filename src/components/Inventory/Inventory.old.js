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
import firebase from "../config/firebase";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import axios from "axios";
import { DataTable } from "react-native-paper";
import { Picker } from "@react-native-picker/picker";
import NumberFormat from "react-number-format";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Inventory = (props) => {
  const user = props.user;
  const shop = props.shop;
  const [refresh, setRefresh] = useState(true);
  const [chosen, setChosen] = useState("Sale");
  const [screen, setScreen] = useState("Sale");
  const btnData = ["Sale", "Purchase", "Stock", "Item"];
  const [itemDetail, setItemDetail] = useState({
    category: "T+L",
    note: "-",
    purchasePrice: 0,
    sellPrice: 0,
  });
  const [error, setError] = useState();
  const [loading, setLoading] = useState(false);
  const [voucherLoad, setVoucherLoad] = useState(0);
  const [item, setItem] = useState([]);
  const [purchase, setPurchase] = useState([]);
  const [purchaseDetail, setPurchaseDetail] = useState({});
  const [sale, setSale] = useState([]);
  const [saleDetail, setSaleDetail] = useState({});
  const [multiSale, setMultiSale] = useState({
    voucher: "",
    customer: "",
    payment: "",
    each: [],
    itemCode: [],
    itemName: [],
    amount: [],
    lot: [],
    qty: [],
    tax: [],
    discount: [],
    paid: [],
    total: [],
    remain: [],
  });
  const [multiPurchase, setMultiPurchase] = useState({
    voucher: "",
    supplier: "",
    payment: "",
    each: [],
    itemCode: [],
    itemName: [],
    amount: [],
    lot: [],
    qty: [],
    tax: [],
    discount: [],
    paid: [],
    total: [],
    remain: [],
    damage: [],
  });
  const [addPurchase, setaddPurchase] = useState(false);
  const [addSale, setaddSale] = useState(false);
  const [success, setsuccess] = useState(false);
  const [code, setCode] = useState();
  const [sortByItem, setSortByItem] = useState("date");
  const [filterDate, setfilterDate] = useState("today");
  const [delOrEditPurchase, setDelOrEditPurchase] = useState(false);
  const [delOrEditSale, setDelOrEditSale] = useState(false);
  // const [shop, setShop] = useState();
  const [branch, setBranch] = useState("all");
  const shopDb = firebase.firestore().collection("Shops");

  const ref1 = useRef();
  const ref2 = useRef();
  const ref3 = useRef();
  const ref4 = useRef();
  const ref5 = useRef();
  const ref6 = useRef();

  const p1 = useRef();
  const p2 = useRef();
  const p3 = useRef();
  const p4 = useRef();
  const p5 = useRef();
  const p6 = useRef();
  const p7 = useRef();
  const p8 = useRef();
  const p9 = useRef();
  const p10 = useRef();
  const p11 = useRef();
  const p12 = useRef();

  const s1 = useRef();
  const s2 = useRef();
  const s3 = useRef();
  const s4 = useRef();
  const s5 = useRef();
  const s6 = useRef();
  const s7 = useRef();
  const s8 = useRef();
  const s9 = useRef();
  const s10 = useRef();
  const s11 = useRef();

  const getItem = async () => {
    await axios
      .post("https://service-manager.hlakabar.com/api/hkb.php?op=getItem", {
        filterDate: filterDate ? filterDate : "today",
      })
      .then(async (res) => {
        let item = res.data[0].item;
        let purchase = res.data[0].purchase;
        let sale = res.data[0].sale;
        purchase.forEach((obj) => {
          obj.qty = +obj.qty;
          obj.total = +obj.total;
          obj.amount = +obj.amount;
          obj.discount = +obj.discount;
          obj.tax = +obj.tax;
          obj.paid = +obj.paid;
          obj.remain = +obj.remain;
          obj.damage = +obj.damage;
        });

        sale.forEach((obj) => {
          obj.qty = +obj.qty;
          obj.total = +obj.total;
          obj.amount = +obj.amount;
          obj.discount = +obj.discount;
          obj.tax = +obj.tax;
          obj.paid = +obj.paid;
          obj.remain = +obj.remain;
          obj.damage = +obj.damage;
        });

        if (branch === "all") {
          setPurchase(
            purchase.sort((a, b) =>
              a[sortByItem].toUpperCase() < b[sortByItem].toUpperCase() ? 1 : -1
            )
          );
          setSale(
            sale.sort((a, b) =>
              a[sortByItem].toUpperCase() < b[sortByItem].toUpperCase() ? 1 : -1
            )
          );
          setItem(
            item.sort((a, b) =>
              a[sortByItem].toUpperCase() < b[sortByItem].toUpperCase() ? 1 : -1
            )
          );
        } else {
          const result = purchase.filter((gg) => gg.branch == branch);
          const result_sale = sale.filter((gg) => gg.branch == branch);
          const result_item = item.filter((gg) => gg.branch == branch);
          if (result == undefined) {
            setPurchase([]);
          } else {
            setPurchase(
              result.sort((a, b) =>
                a[sortByItem].toUpperCase() < b[sortByItem].toUpperCase()
                  ? 1
                  : -1
              )
            );
          }
          if (result_sale == undefined) {
            setSale([]);
          } else {
            setSale(
              result_sale.sort((a, b) =>
                a[sortByItem].toUpperCase() < b[sortByItem].toUpperCase()
                  ? 1
                  : -1
              )
            );
          }
          if (result_item == undefined) {
            setItem([]);
          } else {
            setItem(
              result_item.sort((a, b) =>
                a[sortByItem].toUpperCase() < b[sortByItem].toUpperCase()
                  ? 1
                  : -1
              )
            );
          }
        }

        try {
          const jsonValue = JSON.stringify(res.data);
          await AsyncStorage.setItem("item", jsonValue);
        } catch (error) {
          console.log("AsyncStorage Error : " + error);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    setItem([]);
    setPurchase([]);
    getItem();
    user != null
      ? (user.branch && setBranch(user.branch)) &
        setItemDetail({ ...itemDetail, user: user.name }) &
        setPurchaseDetail({
          ...purchaseDetail,
          user: user.name,
        }) &
        setSaleDetail({
          ...saleDetail,
          user: user.name,
        }) &
        setMultiSale({
          ...multiSale,
          user: user.name,
        }) &
        setMultiPurchase({
          ...multiPurchase,
          user: user.name,
        })
      : null;
  }, [filterDate, loading, sortByItem, refresh, branch]);

  function filterIt(arr, searchKey) {
    return arr.filter(function (obj) {
      return Object.keys(obj).some(function (key) {
        return obj[key].toString().toLowerCase().includes(searchKey);
      });
    });
  }

  const renderItem = () => {
    const clearInput = () => {
      ref1.current.clear();
      ref2.current.clear();
      ref3.current.clear();
      ref4.current.clear();
      ref5.current.clear();
      ref6.current.clear();

      ref1.current.focus();
    };

    const saveItem = async () => {
      setsuccess(false);
      if (branch === "all") {
        var b = [];
        shop.map((a) => {
          b.push(a.branch);
        });
      }
      setError();
      setLoading(true);
      await axios
        .post("https://service-manager.hlakabar.com/api/hkb.php?op=saveItem", {
          ...itemDetail,
          branch: branch === "all" ? b : branch,
        })
        .then((res) => {
          console.log(res);
          setLoading(false);
          setError();
          ref1.current.focus();
          clearInput();
          setsuccess(true);
        })
        .catch((err) => {
          console.log(err);
          clearInput();
          setLoading(false);
          setError(err.message);
        });
    };

    return (
      <View style={styles.addContainer}>
        <View style={styles.addItemList}>
          <View
            style={{
              width: "100%",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <View
              style={{
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text
                style={{ fontSize: 14, fontWeight: "bold", marginBottom: 5 }}
              >
                Item List
              </Text>
              <TextInput
                onKeyPress={async (e) => {
                  if (e.key === "Backspace") {
                    try {
                      const jsonValue = await AsyncStorage.getItem("item");
                      jsonValue != null ? setItem(JSON.parse(jsonValue)) : null;
                    } catch (e) {
                      console.log(e);
                    }
                  }
                }}
                placeholder="Search Everything"
                style={styles.input1}
                onChangeText={(text) => {
                  text === ""
                    ? setRefresh(!refresh)
                    : setItem(filterIt(item, text.toLowerCase()));
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
                <Picker.Item label="Item Code" value="itemCode" />
                <Picker.Item label="Item Name" value="itemName" />
                <Picker.Item label="Category" value="category" />
                <Picker.Item label="Input User" value="user" />
                <Picker.Item label="Note" value="note" />
              </Picker>
            </View>
            <Text style={styles.dataText}>
              Justify Purchase ={" "}
              {item != [] &&
                item.reduce((a, b) => {
                  return a + parseInt(b.purchasePrice);
                }, 0) / item.length}
            </Text>
            <Text
              style={{
                fontWeight: "bold",
                fontSize: 14,
              }}
            >
              Total Item = {item.length}
            </Text>
            <TouchableOpacity
              onPress={() => {
                setRefresh(!refresh);
              }}
            >
              <MaterialCommunityIcons name="refresh" size={24} color="black" />
            </TouchableOpacity>
          </View>
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
              <DataTable.Title style={styles.tableTitle}>
                Branch No.
              </DataTable.Title>
              <DataTable.Title style={styles.tableTitle}>
                Item Code
              </DataTable.Title>
              <DataTable.Title style={styles.tableTitle}>
                Item Name
              </DataTable.Title>
              <DataTable.Title style={styles.tableTitle}>
                Lot No.
              </DataTable.Title>
              <DataTable.Title style={styles.tableTitle}>
                Category
              </DataTable.Title>
              <DataTable.Title style={styles.tableTitle}>
                Purchase Price
              </DataTable.Title>
              <DataTable.Title style={styles.tableTitle}>
                Sell Price
              </DataTable.Title>
              <DataTable.Title style={styles.tableTitle}>
                Input User
              </DataTable.Title>

              <DataTable.Title style={styles.tableTitle}>Date</DataTable.Title>

              <DataTable.Title
                style={[styles.tableTitle, { borderRightWidth: 0 }]}
              >
                Note
              </DataTable.Title>
            </DataTable.Header>
            <ScrollView
              style={{
                width: "100%",
                flex: 1,
                borderWidth: 1,
                borderBottomWidth: 0,
              }}
              showsVerticalScrollIndicator={false}
            >
              {item != [] &&
                item.map((item, index) => {
                  return (
                    <DataTable.Row
                      key={item.id}
                      onPress={() => {
                        setItemDetail(item);
                        setCode(item.itemCode);
                        ref1.current.value = item.itemCode;
                        ref2.current.value = item.itemName;
                        ref3.current.value = item.purchasePrice;
                        ref4.current.value = item.sellPrice;
                        ref5.current.value = item.note;
                      }}
                      style={{
                        backgroundColor: index % 2 === 0 ? "#fff" : "#dedede",
                      }}
                    >
                      <View style={styles.tableTitle}>
                        <Text style={styles.dataText} numberOfLines={3}>
                          {item.branch}
                        </Text>
                      </View>
                      <View style={styles.tableTitle}>
                        <Text style={styles.dataText} numberOfLines={3}>
                          {item.itemCode}
                        </Text>
                      </View>
                      <View style={styles.tableTitle}>
                        <Text style={styles.dataText} numberOfLines={3}>
                          {item.itemName}
                        </Text>
                      </View>
                      <View style={styles.tableTitle}>
                        <Text style={styles.dataText} numberOfLines={3}>
                          {item.lot}
                        </Text>
                      </View>
                      <View style={styles.tableTitle}>
                        <Text style={styles.dataText} numberOfLines={3}>
                          {item.category}
                        </Text>
                      </View>
                      <View style={styles.tableTitle}>
                        <Text style={styles.dataText} numberOfLines={3}>
                          {item.purchasePrice}
                        </Text>
                      </View>
                      <View style={styles.tableTitle}>
                        <Text style={styles.dataText} numberOfLines={3}>
                          {item.sellPrice}
                        </Text>
                      </View>
                      <View style={styles.tableTitle}>
                        <Text style={styles.dataText} numberOfLines={3}>
                          {item.user}
                        </Text>
                      </View>

                      <View style={styles.tableTitle}>
                        <Text style={styles.dataText} numberOfLines={3}>
                          {item.date}
                        </Text>
                      </View>

                      <View
                        style={[styles.tableTitle, { borderRightWidth: 0 }]}
                      >
                        <Text style={styles.dataText} numberOfLines={3}>
                          {item.note}
                        </Text>
                      </View>
                    </DataTable.Row>
                  );
                })}
            </ScrollView>
          </DataTable>
        </View>
        <View style={styles.addItemDetail}>
          <Text style={{ fontSize: 14, fontWeight: "bold", marginBottom: 5 }}>
            Add Item Detail
          </Text>
          <View style={styles.inputContainer}>
            <Text style={styles.inputText}>Item Code</Text>
            <TextInput
              ref={ref1}
              style={styles.input}
              onChangeText={(text) => {
                setItemDetail({ ...itemDetail, itemCode: text });
              }}
            />
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.inputText}>Item Name</Text>
            <TextInput
              ref={ref2}
              style={styles.input}
              onChangeText={(text) => {
                setItemDetail({ ...itemDetail, itemName: text });
              }}
            />
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.inputText}>Lot No.</Text>
            <TextInput
              ref={ref6}
              style={styles.input}
              onChangeText={(text) => {
                setItemDetail({ ...itemDetail, lot: text });
              }}
            />
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.inputText}>Category</Text>
            <Picker
              style={styles.input}
              selectedValue={itemDetail.category ? itemDetail.category : "T+L"}
              onValueChange={(itemValue, itemIndex) =>
                setItemDetail({ ...itemDetail, category: itemValue })
              }
            >
              <Picker.Item label="T+L" value="T+L" />
              <Picker.Item label="Battery" value="Battery" />
              <Picker.Item label="Glass" value="Glass" />
              <Picker.Item label="Touch" value="Touch" />
              <Picker.Item label="LCD" value="LCD" />
              <Picker.Item label="Cover" value="Cover" />
              <Picker.Item label="Body Cover" value="BodyCover" />
            </Picker>
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.inputText}>Purchase Price</Text>
            <TextInput
              ref={ref3}
              style={styles.input}
              onChangeText={(text) => {
                setItemDetail({ ...itemDetail, purchasePrice: text });
              }}
            />
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.inputText}>Sell Price</Text>
            <TextInput
              ref={ref4}
              style={styles.input}
              onChangeText={(text) => {
                setItemDetail({ ...itemDetail, sellPrice: text });
              }}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputText}>Note</Text>
            <TextInput
              ref={ref5}
              style={styles.input}
              onChangeText={(text) => {
                text && setItemDetail({ ...itemDetail, note: text });
              }}
            />
          </View>
          <TouchableOpacity
            style={styles.btn1}
            onPress={() => {
              setsuccess(false);
              if (!itemDetail.user) {
                setError("Please Login First");
              } else if (!itemDetail.itemCode) {
                setError("Please Input Code");
              } else if (item.some((e) => e.itemCode === itemDetail.itemCode)) {
                setError("Item Code Already Existed");
              } else if (!itemDetail.itemName) {
                setError("Please Input Name");
              } else {
                delete itemDetail.id;
                saveItem();
              }
            }}
          >
            <Text style={{ fontWeight: "bold", fontSize: 12, color: "#fff" }}>
              Add New Item
            </Text>
          </TouchableOpacity>

          <View
            style={{
              flexDirection: "row",
              width: "100%",
              justifyContent: "space-evenly",
              alignItems: "center",
              marginVertical: 5,
            }}
          >
            <TouchableOpacity
              style={[styles.btn1, { backgroundColor: "#8a0000cf" }]}
              onPress={async () => {
                const itemDetails = { ...itemDetail, delete: "true" };
                setsuccess(false);
                setError();
                setLoading(true);
                await axios
                  .post(
                    "https://service-manager.hlakabar.com/api/hkb.php?op=saveItem",
                    {
                      ...itemDetails,
                      branch: branch,
                    }
                  )
                  .then((res) => {
                    setLoading(false);
                    setError();
                    clearInput();
                    setsuccess(true);
                  })
                  .catch((err) => {
                    console.log(err);
                    setLoading(false);
                    setError(err.message);
                  });
              }}
            >
              <Text style={{ fontWeight: "bold", fontSize: 12, color: "#fff" }}>
                Delete Item
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.btn1, { backgroundColor: "#8a2000cf" }]}
              onPress={() => {
                setsuccess(false);
                if (!itemDetail.user) {
                  setError("Please Login First");
                } else if (!itemDetail.itemCode) {
                  setError("Please Input Code");
                } else if (
                  item.some((e) => e.itemCode === itemDetail.itemCode) &&
                  code != itemDetail.itemCode
                ) {
                  setError("Item Code Already Existed");
                } else if (!itemDetail.itemName) {
                  setError("Please Input Name");
                } else {
                  saveItem();
                }
              }}
            >
              <Text style={{ fontWeight: "bold", fontSize: 12, color: "#fff" }}>
                Edit Item
              </Text>
            </TouchableOpacity>
          </View>
          {error && (
            <TouchableOpacity
              onPress={() => {
                setError(false);
              }}
            >
              <Text
                style={{ fontSize: 10, fontWeight: "bold", color: "orange" }}
              >
                {error}
              </Text>
            </TouchableOpacity>
          )}
          {success && (
            <TouchableOpacity
              onPress={() => {
                setsuccess(false);
              }}
            >
              <Text
                style={{ fontSize: 10, fontWeight: "bold", color: "green" }}
              >
                Success
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  };

  const renderStock = () => {
    return (
      <View style={[styles.addContainer, { flexDirection: "column", flex: 1 }]}>
        <View
          style={{
            width: "100%",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Text style={{ fontSize: 14, fontWeight: "bold", marginBottom: 5 }}>
              Item List
            </Text>
            <TextInput
              placeholder="Search Everything"
              style={styles.input1}
              onChangeText={(text) => {
                text === ""
                  ? setRefresh(!refresh)
                  : setItem(filterIt(item, text.toLowerCase()));
              }}
            />
            <Text style={{ fontWeight: "bold", fontSize: 12, marginLeft: 20 }}>
              Sort By{" "}
            </Text>
            <Picker
              style={styles.input1}
              selectedValue={sortByItem}
              onValueChange={(itemValue, itemIndex) => setSortByItem(itemValue)}
            >
              <Picker.Item label="Date" value="date" />
              <Picker.Item label="Item Code" value="itemCode" />
              <Picker.Item label="Item Name" value="itemName" />
              <Picker.Item label="Category" value="category" />
              <Picker.Item label="Input User" value="user" />

              <Picker.Item label="Note" value="note" />
            </Picker>
          </View>

          <Text
            style={{
              fontWeight: "bold",
              fontSize: 14,
            }}
          >
            Total Item = {item.length}
          </Text>
          <TouchableOpacity
            onPress={() => {
              setSortByItem("date");
            }}
          >
            <MaterialCommunityIcons name="refresh" size={24} color="black" />
          </TouchableOpacity>
        </View>
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
            <DataTable.Title style={styles.tableTitle}>No.</DataTable.Title>
            <DataTable.Title style={styles.tableTitle}>
              Branch No.
            </DataTable.Title>
            <DataTable.Title style={styles.tableTitle}>
              Item Code
            </DataTable.Title>
            <DataTable.Title style={styles.tableTitle}>
              Item Name
            </DataTable.Title>
            <DataTable.Title style={styles.tableTitle}>Lot No.</DataTable.Title>
            <DataTable.Title style={styles.tableTitle}>
              Category
            </DataTable.Title>
            <DataTable.Title style={styles.tableTitle}>Qty.</DataTable.Title>

            <DataTable.Title style={styles.tableTitle}>Damage</DataTable.Title>
            <DataTable.Title style={styles.tableTitle}>Total</DataTable.Title>

            <DataTable.Title
              style={[styles.tableTitle, { borderRightWidth: 0 }]}
            >
              Date
            </DataTable.Title>
          </DataTable.Header>
          <ScrollView
            style={{
              width: "100%",
              flex: 1,
              borderWidth: 1,
              borderBottomWidth: 0,
            }}
            showsVerticalScrollIndicator={false}
          >
            {item != [] &&
              item.map((item, index) => {
                return (
                  <DataTable.Row
                    key={item.id}
                    onPress={() => {
                      setItemDetail(item);
                      setCode(item.itemCode);
                    }}
                    style={{
                      backgroundColor: index % 2 === 0 ? "#fff" : "#dedede",
                    }}
                  >
                    <View style={styles.tableTitle}>
                      <Text style={styles.dataText} numberOfLines={3}>
                        {index + 1}
                      </Text>
                    </View>
                    <View style={styles.tableTitle}>
                      <Text style={styles.dataText} numberOfLines={3}>
                        {item.branch}
                      </Text>
                    </View>
                    <View style={styles.tableTitle}>
                      <Text style={styles.dataText} numberOfLines={3}>
                        {item.itemCode}
                      </Text>
                    </View>
                    <View style={styles.tableTitle}>
                      <Text style={styles.dataText} numberOfLines={3}>
                        {item.itemName}
                      </Text>
                    </View>
                    <View style={styles.tableTitle}>
                      <Text style={styles.dataText} numberOfLines={3}>
                        Lot {item.lot}
                      </Text>
                    </View>
                    <View style={styles.tableTitle}>
                      <Text style={styles.dataText} numberOfLines={3}>
                        {item.category}
                      </Text>
                    </View>
                    <View style={styles.tableTitle}>
                      <Text style={styles.dataText} numberOfLines={3}>
                        {item.qty}
                      </Text>
                    </View>

                    <View style={styles.tableTitle}>
                      <Text style={styles.dataText} numberOfLines={3}>
                        {item.damage}
                      </Text>
                    </View>
                    <View
                      style={[
                        styles.tableTitle,
                        {
                          backgroundColor:
                            (item.total == 0 && "red") ||
                            (item.total <= 3 && "yellow"),
                        },
                      ]}
                    >
                      <Text style={styles.dataText} numberOfLines={3}>
                        {item.total}
                      </Text>
                    </View>

                    <View style={[styles.tableTitle, { borderRightWidth: 0 }]}>
                      <Text style={styles.dataText} numberOfLines={3}>
                        {item.date}
                      </Text>
                    </View>
                  </DataTable.Row>
                );
              })}
          </ScrollView>
        </DataTable>
      </View>
    );
  };

  const renderPurchase = () => {
    const clearInput = () => {
      p1.current.clear();
      p2.current.clear();
      p3.current.clear();
      // p4.current.clear();
      // p5.current.clear();
      // p6.current.clear();
      // p7.current.clear();
      p8.current.clear();
      // p9.current.clear();
      // p10.current.clear();
      // p11.current.clear();
      // p12.current.clear();
      setMultiPurchase({
        voucher: "",
        supplier: "",
        payment: "",
        itemCode: [],
        each: [],
        itemName: [],
        amount: [],
        lot: [],
        qty: [],
        tax: [],
        discount: [],
        paid: [],
        total: [],
        remain: [],
        damage: [],
      });
    };

    const purchasefunc = async (p) => {
      setsuccess(false);
      setError();
      setLoading(true);
      await axios
        .post(
          "https://service-manager.hlakabar.com/api/hkb.php?op=multi_purchase",
          p
        )
        .then((res) => {
          console.log(res);
          setLoading(false);
          setError();
          setsuccess(true);
          p2.current.focus();
        })
        .catch((err) => {
          console.log(err);
          clearInput();
          setLoading(false);
          setError(err.message);
        });
      clearInput();
    };

    const purchaseFunction = async (p) => {
      setsuccess(false);
      setError();
      setLoading(true);
      setPurchaseDetail({});
      await axios
        .post("https://service-manager.hlakabar.com/api/hkb.php?op=purchase", p)
        .then((res) => {
          console.log(res);
          setLoading(false);
          setError();
          setsuccess(true);
          setDelOrEditPurchase(false);
        })
        .catch((err) => {
          console.log(err);
          setLoading(false);
          setError(err.message);
        });
    };

    return (
      <View style={[styles.addContainer, { flexDirection: "column", flex: 1 }]}>
        <View style={styles.addItemList}>
          <Text
            style={{
              fontWeight: "bold",
              fontSize: 14,
            }}
          >
            Purchase List
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
                  delete purchaseDetail.id;
                  setsuccess(false);
                  setError();
                  setaddPurchase(true);
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
                    : setPurchase(filterIt(purchase, text.toLowerCase()));
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
                <Picker.Item label="Item Code" value="itemCode" />
                <Picker.Item label="Item Name" value="itemName" />
                <Picker.Item label="Lot No." value="lot" />
                <Picker.Item label="User" value="user" />
                <Picker.Item label="Supplier" value="supplier" />
              </Picker>
            </View>

            <Text
              style={{
                fontWeight: "bold",
                fontSize: 14,
              }}
            >
              Total Purchase Item = {purchase.length}
            </Text>
            <TouchableOpacity
              onPress={() => {
                setRefresh(!refresh);
              }}
            >
              <MaterialCommunityIcons name="refresh" size={24} color="black" />
            </TouchableOpacity>
          </View>
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
              <DataTable.Title style={styles.tableTitle}>
                ရက်စွဲ
              </DataTable.Title>
              <DataTable.Title style={styles.tableTitle}>
                ဆိုင်ခွဲ
              </DataTable.Title>
              <DataTable.Title style={styles.tableTitle}>
                ဘောက်ချာ
              </DataTable.Title>
              <DataTable.Title style={styles.tableTitle}>ကုတ်</DataTable.Title>
              <DataTable.Title style={styles.tableTitle}>
                ပစ္စည်းအမည်
              </DataTable.Title>
              <DataTable.Title style={styles.tableTitle}>
                လော့နံပါတ်
              </DataTable.Title>
              <DataTable.Title style={styles.tableTitle}>User</DataTable.Title>
              <DataTable.Title style={styles.tableTitle}>
                ကုန်သည်
              </DataTable.Title>
              <DataTable.Title style={styles.tableTitle}>
                ငွေချေပုံ
              </DataTable.Title>
              <DataTable.Title style={styles.tableTitle}>Qty</DataTable.Title>
              <DataTable.Title style={styles.tableTitle}>
                နှုန်း
              </DataTable.Title>
              <DataTable.Title style={styles.tableTitle}>
                လျော့ငွေ
              </DataTable.Title>
              <DataTable.Title style={styles.tableTitle}>အခွန်</DataTable.Title>
              <DataTable.Title style={styles.tableTitle}>
                ပေးငွေ
              </DataTable.Title>
              <DataTable.Title style={styles.tableTitle}>
                စုစုပေါင်း
              </DataTable.Title>
              <DataTable.Title style={styles.tableTitle}>
                ကျန်ငွေ
              </DataTable.Title>

              <DataTable.Title
                style={[styles.tableTitle, { borderRightWidth: 0 }]}
              >
                အပျက်/ပြန်လဲ
              </DataTable.Title>
            </DataTable.Header>

            <ScrollView
              style={{
                width: "100%",
                flex: 1,
                borderWidth: 1,
                borderBottomWidth: 0,
              }}
              showsVerticalScrollIndicator={false}
            >
              {purchase &&
                purchase != [] &&
                purchase.map((purchase, index) => {
                  return (
                    <DataTable.Row
                      key={purchase.id}
                      onPress={() => {
                        setPurchaseDetail({
                          ...purchase,
                          pqty: purchase.qty,
                          ptotal: purchase.total,
                          ppaid: purchase.paid,
                          pdamage: purchase.damage,
                          pdate: purchase.date,
                        });
                        setDelOrEditPurchase(true);
                      }}
                      style={{
                        backgroundColor: index % 2 === 0 ? "#fff" : "#dedede",
                      }}
                    >
                      <View style={styles.tableTitle}>
                        <Text style={styles.dataText} numberOfLines={3}>
                          {purchase.date}
                        </Text>
                      </View>
                      <View style={styles.tableTitle}>
                        <Text style={styles.dataText} numberOfLines={3}>
                          {purchase.branch}
                        </Text>
                      </View>
                      <View style={styles.tableTitle}>
                        <Text style={styles.dataText} numberOfLines={3}>
                          {purchase.voucher}
                        </Text>
                      </View>
                      <View style={styles.tableTitle}>
                        <Text style={styles.dataText} numberOfLines={3}>
                          {purchase.itemCode}
                        </Text>
                      </View>
                      <View style={styles.tableTitle}>
                        <Text style={styles.dataText} numberOfLines={3}>
                          {purchase.itemName}
                        </Text>
                      </View>
                      <View style={styles.tableTitle}>
                        <Text style={styles.dataText} numberOfLines={3}>
                          {purchase.lot}
                        </Text>
                      </View>
                      <View style={styles.tableTitle}>
                        <Text style={styles.dataText} numberOfLines={3}>
                          {purchase.user}
                        </Text>
                      </View>
                      <View style={styles.tableTitle}>
                        <Text style={styles.dataText} numberOfLines={3}>
                          {purchase.supplier}
                        </Text>
                      </View>
                      <View style={styles.tableTitle}>
                        <Text style={styles.dataText} numberOfLines={3}>
                          {purchase.payment}
                        </Text>
                      </View>
                      <View style={styles.tableTitle}>
                        <Text style={styles.dataText} numberOfLines={3}>
                          {purchase.qty}
                        </Text>
                      </View>
                      <View style={styles.tableTitle}>
                        <Text style={styles.dataText} numberOfLines={3}>
                          <NumberFormat
                            value={purchase.amount}
                            displayType={"text"}
                            thousandSeparator={true}
                          />
                        </Text>
                      </View>
                      <View style={styles.tableTitle}>
                        <Text style={styles.dataText} numberOfLines={3}>
                          {purchase.discount}
                        </Text>
                      </View>
                      <View style={styles.tableTitle}>
                        <Text style={styles.dataText} numberOfLines={3}>
                          {purchase.tax}
                        </Text>
                      </View>
                      <View style={styles.tableTitle}>
                        <Text style={styles.dataText} numberOfLines={3}>
                          <NumberFormat
                            value={purchase.paid}
                            displayType={"text"}
                            thousandSeparator={true}
                          />
                        </Text>
                      </View>
                      <View style={styles.tableTitle}>
                        <Text style={styles.dataText} numberOfLines={3}>
                          <NumberFormat
                            value={purchase.total}
                            displayType={"text"}
                            thousandSeparator={true}
                          />
                        </Text>
                      </View>
                      <View style={styles.tableTitle}>
                        <Text style={styles.dataText} numberOfLines={3}>
                          <NumberFormat
                            value={purchase.remain}
                            displayType={"text"}
                            thousandSeparator={true}
                          />
                        </Text>
                      </View>
                      <View
                        style={[styles.tableTitle, { borderRightWidth: 0 }]}
                      >
                        <Text style={styles.dataText} numberOfLines={3}>
                          {purchase.damage}
                        </Text>
                      </View>
                    </DataTable.Row>
                  );
                })}
            </ScrollView>
            <DataTable.Row
              style={{
                backgroundColor: "#6836838f",
                borderWidth: 1,
              }}
            >
              <View style={styles.tableTitle}>
                <Text style={styles.dataText} numberOfLines={3}>
                  Qty ={" "}
                  {purchase != [] &&
                    purchase.reduce((a, b) => {
                      return a + b.qty;
                    }, 0)}
                </Text>
              </View>
              <View style={styles.tableTitle}>
                <Text style={styles.dataText} numberOfLines={3}>
                  Justify ={" "}
                  {purchase != [] &&
                    purchase.reduce((a, b) => {
                      return a + b.amount;
                    }, 0) / purchase.length}
                </Text>
              </View>
              <View style={styles.tableTitle}>
                <Text style={styles.dataText} numberOfLines={3}>
                  လျော့ငွေ ={" "}
                  <NumberFormat
                    value={
                      purchase != [] &&
                      purchase.reduce((a, b) => {
                        return a + b.discount;
                      }, 0)
                    }
                    displayType={"text"}
                    thousandSeparator={true}
                  />
                </Text>
              </View>
              <View style={styles.tableTitle}>
                <Text style={styles.dataText} numberOfLines={3}>
                  အခွန် ={" "}
                  {purchase != [] &&
                    purchase.reduce((a, b) => {
                      return a + b.tax;
                    }, 0)}
                </Text>
              </View>
              <View style={styles.tableTitle}>
                <Text style={styles.dataText} numberOfLines={3}>
                  ပေးငွေ ={" "}
                  <NumberFormat
                    value={
                      purchase != [] &&
                      purchase.reduce((a, b) => {
                        return a + b.paid;
                      }, 0)
                    }
                    displayType={"text"}
                    thousandSeparator={true}
                  />
                </Text>
              </View>
              <View style={styles.tableTitle}>
                <Text style={styles.dataText} numberOfLines={3}>
                  စုစုပေါင်း ={" "}
                  <NumberFormat
                    value={
                      purchase != [] &&
                      purchase.reduce((a, b) => {
                        return a + b.total;
                      }, 0)
                    }
                    displayType={"text"}
                    thousandSeparator={true}
                  />
                </Text>
              </View>
              <View style={styles.tableTitle}>
                <Text style={styles.dataText} numberOfLines={3}>
                  ကျန်ငွေ ={" "}
                  {purchase != [] &&
                    purchase.reduce((a, b) => {
                      return a + b.remain;
                    }, 0)}
                </Text>
              </View>
              <View style={[styles.tableTitle, { borderRightWidth: 0 }]}>
                <Text style={styles.dataText} numberOfLines={3}>
                  အပျက်/ပြန်လဲ ={" "}
                  {purchase != [] &&
                    purchase.reduce((a, b) => {
                      return a + b.damage;
                    }, 0)}
                </Text>
              </View>
            </DataTable.Row>
          </DataTable>
        </View>
        {addPurchase && (
          <View style={styles.modalView}>
            <TouchableOpacity
              style={{ right: 20, top: 20, position: "absolute" }}
              onPress={() => {
                setaddPurchase(false);
                setDelOrEditPurchase(false);
                setsuccess(false);
                setError();
                delete purchaseDetail.id;
                setRefresh(!refresh);
                setPurchaseDetail({ ...purchaseDetail, itemName: "" });
                clearInput();
              }}
            >
              <MaterialCommunityIcons
                name="close-circle"
                size={24}
                color="#683683"
              />
            </TouchableOpacity>
            <View style={styles.saleModal}>
              <ScrollView
                showsVerticalScrollIndicator={false}
                style={{
                  width: "100%",
                  height: "100%",
                  flex: 1,
                  paddingHorizontal: 10,
                  paddingVertical: 20,
                }}
                contentContainerStyle={{
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Text style={styles.headerText}> အဝယ်စာရင်း </Text>
                <View style={styles.voucherItem}>
                  <Text style={styles.dataText}>ဘောက်ချာ</Text>
                  <TextInput
                    ref={p2}
                    onChangeText={(text) => {
                      setMultiPurchase({ ...multiPurchase, voucher: text });
                    }}
                    style={[styles.voucherInput]}
                    placeholder="ဘောက်ချာ"
                  />
                </View>
                <View style={styles.voucherItem}>
                  <Text style={styles.dataText}>ကုန်သည်</Text>
                  <TextInput
                    ref={p3}
                    onChangeText={(text) => {
                      setMultiPurchase({ ...multiPurchase, supplier: text });
                    }}
                    style={[styles.voucherInput]}
                    placeholder="ကုန်သည်"
                  />
                </View>
                <View style={styles.voucherItem}>
                  <Text style={styles.dataText}>Payment</Text>
                  <TextInput
                    ref={p8}
                    onChangeText={(text) => {
                      setMultiPurchase({ ...multiPurchase, payment: text });
                    }}
                    style={[styles.voucherInput]}
                    placeholder="payment"
                  />
                </View>
                <View style={styles.voucherItem}>
                  <Text style={styles.dataText}>Code </Text>
                  <TextInput
                    ref={p1}
                    onKeyPress={(e) => {
                      if (e.nativeEvent.key === "Enter") {
                        const result = item.find(
                          ({ itemCode }) => itemCode === p1.current.value
                        );
                        setVoucherLoad(voucherLoad + 1);
                        if (result) {
                          multiPurchase.itemCode.push(result.itemCode);
                          multiPurchase.itemName.push(result.itemName);
                          multiPurchase.amount.push(
                            parseInt(result.purchasePrice)
                          );
                          multiPurchase.lot.push(result.lot);
                          multiPurchase.qty.push(1);
                          multiPurchase.tax.push(0);
                          multiPurchase.discount.push(0);
                          multiPurchase.damage.push(0);
                          multiPurchase.paid.push(
                            parseInt(result.purchasePrice)
                          );
                          multiPurchase.total.push(
                            parseInt(result.purchasePrice)
                          );
                          multiPurchase.remain.push(0);
                          multiPurchase.each.push(
                            parseInt(result.purchasePrice)
                          );
                        } else {
                          setChosen("Item");
                          setScreen("Item");
                          setError("No Item Found");
                        }
                      }
                    }}
                    style={[styles.voucherInput]}
                    placeholder="code"
                  />
                </View>
                {multiPurchase.itemCode != [] &&
                  multiPurchase.itemCode.map((code, i) => {
                    return (
                      <View style={styles.voucherItem} key={code}>
                        <Text style={styles.dataText}>
                          {multiPurchase.itemName != []
                            ? multiPurchase.itemName[i]
                            : "ပစ္စည်းအမည်"}
                        </Text>
                        <Text style={styles.dataText}>
                          {multiPurchase.lot != []
                            ? "Lot-" + multiPurchase.lot[i]
                            : "လော့နံပါတ်"}
                        </Text>
                        <View
                          style={{
                            flexDirection: "row",
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        >
                          <TouchableOpacity
                            onPress={() => {
                              let q = multiPurchase.qty[i] - 1;
                              let t =
                                multiPurchase.amount[i] * q +
                                (multiPurchase.tax[i] -
                                  multiPurchase.discount[i]);
                              multiPurchase.total[i] = t;
                              multiPurchase.paid[i] = t;
                              multiPurchase.qty[i] = q;
                              if (q === 0) {
                                multiPurchase.itemCode.splice(i, 1);
                                multiPurchase.qty.splice(i, 1);
                                multiPurchase.itemName.splice(i, 1);
                                multiPurchase.amount.splice(i, 1);
                                multiPurchase.lot.splice(i, 1);
                                multiPurchase.tax.splice(i, 1);
                                multiPurchase.discount.splice(i, 1);
                                multiPurchase.paid.splice(i, 1);
                                multiPurchase.total.splice(i, 1);
                                multiPurchase.remain.splice(i, 1);
                                multiPurchase.each.splice(i, 1);
                              }
                              setVoucherLoad(voucherLoad - 1);
                            }}
                          >
                            <MaterialCommunityIcons
                              name="arrow-left-drop-circle"
                              size={20}
                              color="#fff"
                            />
                          </TouchableOpacity>
                          <Text
                            style={[styles.dataText, { marginHorizontal: 2 }]}
                          >
                            {multiPurchase.qty != []
                              ? multiPurchase.qty[i]
                              : "Qty."}
                          </Text>
                          <TouchableOpacity
                            onPress={() => {
                              let q = multiPurchase.qty[i] + 1;

                              const result = item.find(
                                ({ itemCode }) =>
                                  itemCode === multiPurchase.itemCode[i]
                              );

                              let t =
                                multiPurchase.amount[i] * q +
                                (multiPurchase.tax[i] -
                                  multiPurchase.discount[i]);
                              multiPurchase.total[i] = t;
                              multiPurchase.paid[i] = t;
                              multiPurchase.qty[i] = q;
                              setVoucherLoad(voucherLoad + 1);
                            }}
                          >
                            <MaterialCommunityIcons
                              name="arrow-right-drop-circle"
                              size={20}
                              color="#fff"
                            />
                          </TouchableOpacity>
                        </View>

                        <TextInput
                          ref={p4}
                          value={multiPurchase.amount[i]}
                          onChangeText={(text) => {
                            setVoucherLoad(voucherLoad + 1);
                            let a = text;
                            multiPurchase.amount[i] = a;
                            multiPurchase.each[i] =
                              multiPurchase.qty[i] * parseInt(text);

                            let q = multiPurchase.qty[i];
                            let t =
                              a * q +
                              (multiPurchase.tax[i] -
                                multiPurchase.discount[i]);
                            multiPurchase.total[i] = t;
                            multiPurchase.paid[i] = t;

                            setVoucherLoad(voucherLoad - 1);
                          }}
                          style={[styles.voucherInput, { width: 70 }]}
                          placeholder="နှုန်း"
                        />
                        <TextInput
                          ref={p5}
                          value={
                            multiPurchase.qty != [] &&
                            multiPurchase.amount != []
                              ? multiPurchase.qty[i] * multiPurchase.amount[i]
                              : "0"
                          }
                          style={[styles.voucherInput, { width: 75 }]}
                          placeholder="စုစုပေါင်း"
                        />
                      </View>
                    );
                  })}

                <View style={styles.voucherItem}>
                  <Text style={styles.dataText}>အခွန်</Text>
                  <TextInput
                    ref={p6}
                    value={
                      multiPurchase.tax
                        ? multiPurchase.tax.reduce((a, b) => a + b, 0)
                        : ""
                    }
                    style={[styles.voucherInput]}
                    placeholder="အခွန်"
                    onChangeText={(text) => {
                      setVoucherLoad(voucherLoad + 1);

                      if (text) {
                        let tax = parseInt(text);
                        for (let i = 0; i < multiPurchase.tax.length; i++) {
                          let ta = tax / multiPurchase.tax.length;
                          multiPurchase.tax[i] = ta;
                          let to =
                            parseInt(multiPurchase.amount[i]) *
                              multiPurchase.qty[i] -
                            parseInt(multiPurchase.discount[i]);
                          let t = to + ta;
                          multiPurchase.total[i] = t;
                          multiPurchase.paid[i] = t;
                        }
                      } else {
                        let tax = 0;
                        for (let i = 0; i < multiPurchase.tax.length; i++) {
                          let ta = tax / multiPurchase.tax.length;
                          multiPurchase.tax[i] = ta;
                          let to =
                            parseInt(multiPurchase.amount[i]) *
                              multiPurchase.qty[i] -
                            parseInt(multiPurchase.discount[i]);
                          let t = to + ta;
                          multiPurchase.total[i] = t;
                          multiPurchase.paid[i] = t;
                        }
                      }
                      setVoucherLoad(voucherLoad - 1);
                    }}
                  />
                </View>
                <View style={styles.voucherItem}>
                  <Text style={styles.dataText}>လျော့ငွေ</Text>
                  <TextInput
                    ref={p7}
                    value={
                      multiPurchase.discount
                        ? multiPurchase.discount.reduce((a, b) => a + b, 0)
                        : ""
                    }
                    style={[styles.voucherInput]}
                    placeholder="လျော့ငွေ"
                    onChangeText={(text) => {
                      setVoucherLoad(voucherLoad + 1);

                      if (text) {
                        let dis = parseInt(text);
                        for (
                          let i = 0;
                          i < multiPurchase.discount.length;
                          i++
                        ) {
                          let di = dis / multiPurchase.discount.length;
                          multiPurchase.discount[i] = di;
                          let to =
                            parseInt(multiPurchase.amount[i]) *
                              multiPurchase.qty[i] +
                            parseInt(multiPurchase.tax[i]);
                          let t = to - di;
                          multiPurchase.total[i] = t;
                          multiPurchase.paid[i] = t;
                        }
                      } else {
                        let dis = 0;
                        for (
                          let i = 0;
                          i < multiPurchase.discount.length;
                          i++
                        ) {
                          let di = dis / multiPurchase.discount.length;
                          multiPurchase.discount[i] = di;
                          let to =
                            parseInt(multiPurchase.amount[i]) *
                              multiPurchase.qty[i] +
                            parseInt(multiPurchase.tax[i]);
                          let t = to - di;
                          multiPurchase.total[i] = t;
                          multiPurchase.paid[i] = t;
                        }
                      }
                      setVoucherLoad(voucherLoad - 1);
                    }}
                  />
                </View>
                <View style={styles.voucherItem}>
                  <Text style={styles.dataText}>ပေးငွေ</Text>
                  <TextInput
                    onChangeText={(text) => {
                      setVoucherLoad(voucherLoad + 1);

                      if (text) {
                        let pa = parseInt(text);
                        for (let i = 0; i < multiPurchase.paid.length; i++) {
                          let p = pa / multiPurchase.paid.length;
                          multiPurchase.paid[i] = p;
                          let to = parseInt(multiPurchase.total[i]);
                          let r = to - p;
                          multiPurchase.remain[i] = r;
                        }
                      } else {
                        let pa = 0;
                        for (let i = 0; i < multiPurchase.paid.length; i++) {
                          let p = [a] / multiPurchase.paid.length;
                          multiPurchase.paid[i] = p;
                          let to = parseInt(multiPurchase.total[i]);
                          let r = to - p;
                          multiPurchase.remain[i] = t;
                        }
                      }
                      setVoucherLoad(voucherLoad - 1);
                    }}
                    ref={p11}
                    value={
                      multiPurchase.paid
                        ? multiPurchase.paid.reduce((a, b) => a + b, 0)
                        : ""
                    }
                    style={[styles.voucherInput]}
                    placeholder="ပေးငွေ"
                  />
                </View>
                <View style={styles.voucherItem}>
                  <Text style={styles.dataText}>စုစုပေါင်း</Text>
                  <TextInput
                    editable={false}
                    ref={p9}
                    value={
                      multiPurchase.total
                        ? multiPurchase.total.reduce((a, b) => a + b, 0)
                        : ""
                    }
                    style={[styles.voucherInput]}
                    placeholder="စုစုပေါင်း"
                    onChangeText={(text) => {
                      setMultiPurchase({
                        ...multiPurchase,
                        total: parseInt(text),
                      });
                    }}
                  />
                </View>
                <View style={styles.voucherItem}>
                  <Text style={styles.dataText}>ကျန်ငွေ</Text>
                  <TextInput
                    editable={false}
                    ref={p10}
                    value={
                      multiPurchase.remain
                        ? multiPurchase.remain.reduce((a, b) => a + b, 0)
                        : ""
                    }
                    style={[styles.voucherInput]}
                    placeholder="ကျန်ငွေ"
                    onChangeText={(text) => {
                      ({ ...multiPurchase, remain: parseInt(text) });
                    }}
                  />
                </View>
                <View style={styles.voucherItem}>
                  <Text style={styles.dataText}>Damage</Text>
                  <TextInput
                    ref={p12}
                    value={multiPurchase.damage}
                    style={[styles.voucherInput]}
                    placeholder="Damage"
                    onChangeText={(text) => {
                      ({ ...multiPurchase, damage: parseInt(text) });
                    }}
                  />
                </View>
              </ScrollView>
              {error && (
                <TouchableOpacity
                  onPress={() => {
                    setError(false);
                  }}
                >
                  <Text
                    style={{
                      fontSize: 10,
                      fontWeight: "bold",
                      color: "orange",
                    }}
                  >
                    {error}
                  </Text>
                </TouchableOpacity>
              )}
              {success && (
                <TouchableOpacity
                  onPress={() => {
                    setsuccess(false);
                  }}
                >
                  <Text
                    style={{
                      fontSize: 10,
                      fontWeight: "bold",
                      color: "green",
                    }}
                  >
                    အောင်မြင်သည်
                  </Text>
                </TouchableOpacity>
              )}
              <View style={styles.innerModalConfirm}>
                <TouchableOpacity
                  style={[
                    styles.btn1,
                    { marginHorizontal: 10, backgroundColor: "gray" },
                  ]}
                  onPress={() => {
                    setMultiPurchase({
                      each: [],
                      itemCode: [],
                      itemName: [],
                      amount: [],
                      lot: [],
                      qty: [],
                      tax: [],
                      discount: [],
                      paid: [],
                      total: [],
                      remain: [],
                    });
                    setsuccess(false);
                    setError();
                    setaddPurchase(false);
                    setDelOrEditPurchase(false);
                    clearInput();
                  }}
                >
                  <Text style={styles.dataText}>ပိတ်ပါ</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.btn1, { marginHorizontal: 10 }]}
                  onPress={() => {
                    multiPurchase.branch = branch;
                    multiPurchase.user = user.name;
                    if (multiPurchase.itemCode.length === 0) {
                      setError("No Item Code");
                    } else if (multiPurchase.itemName.length === 0) {
                      setError("No Item Name/Wrong Item Code");
                    } else if (!multiPurchase.user) {
                      setError("No User/Login In First");
                    } else if (multiPurchase.lot.length === 0) {
                      setError("No Lot Number");
                    } else if (!multiPurchase.supplier) {
                      setError("No Supplier");
                    } else if (!multiPurchase.payment) {
                      setError("No Payment");
                    } else if (!multiPurchase.voucher) {
                      setError("No Voucher");
                    } else if (multiPurchase.qty.length === 0) {
                      setError("No Qty");
                    } else if (multiPurchase.amount.length === 0) {
                      setError("No Amount");
                    } else if (multiPurchase.discount.length === 0) {
                      setError("No Discount");
                    } else if (multiPurchase.tax.length === 0) {
                      setError("No Tax");
                    } else if (multiPurchase.paid.length === 0) {
                      setError("No Paid");
                    } else if (multiPurchase.total.length === 0) {
                      setError("No Total");
                    } else if (multiPurchase.remain.length === 0) {
                      setError("No Remain");
                    } else {
                      let p = multiPurchase;
                      purchasefunc(p);
                    }
                  }}
                >
                  <Text style={[styles.dataText, { color: "#fff" }]}>
                    သိမ်းမည်
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
        {delOrEditPurchase && (
          <View style={styles.modalView}>
            <TouchableOpacity
              style={{ right: 20, top: 20, position: "absolute" }}
              onPress={() => {
                setaddPurchase(false);
                setDelOrEditPurchase(false);
                setsuccess(false);
                setError();
                delete purchaseDetail.id;
                setRefresh(!refresh);
                setPurchaseDetail({});
              }}
            >
              <MaterialCommunityIcons
                name="close-circle"
                size={24}
                color="#683683"
              />
            </TouchableOpacity>
            <View style={styles.saleModal}>
              <View style={styles.saleModal}>
                <ScrollView
                  showsVerticalScrollIndicator={false}
                  style={{
                    width: "100%",
                    height: "100%",
                    flex: 1,
                    paddingHorizontal: 10,
                    paddingVertical: 20,
                  }}
                  contentContainerStyle={{
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text style={styles.headerText}> အဝယ်စာရင်း </Text>
                  <View style={styles.voucherItem}>
                    <Text style={styles.dataText}>ဘောက်ချာ</Text>
                    <TextInput
                      value={
                        purchaseDetail.voucher ? purchaseDetail.voucher : ""
                      }
                      onChangeText={(text) => {
                        setPurchaseDetail({ ...purchaseDetail, voucher: text });
                      }}
                      style={[styles.voucherInput]}
                      placeholder="ဘောက်ချာ"
                    />
                  </View>
                  <View style={styles.voucherItem}>
                    <Text style={styles.dataText}>ကုန်သည်</Text>
                    <TextInput
                      value={
                        purchaseDetail.supplier ? purchaseDetail.supplier : ""
                      }
                      onChangeText={(text) => {
                        setPurchaseDetail({
                          ...purchaseDetail,
                          supplier: text,
                        });
                      }}
                      style={[styles.voucherInput]}
                      placeholder="ကုန်သည်"
                    />
                  </View>
                  <View style={styles.voucherItem}>
                    <Text style={styles.dataText}>Payment</Text>
                    <TextInput
                      value={
                        purchaseDetail.payment ? purchaseDetail.payment : ""
                      }
                      onChangeText={(text) => {
                        setPurchaseDetail({ ...purchaseDetail, payment: text });
                      }}
                      style={[styles.voucherInput]}
                      placeholder="Payment"
                    />
                  </View>
                  <View style={styles.voucherItem}>
                    <Text style={styles.dataText}>Code</Text>
                    <TextInput
                      value={
                        purchaseDetail.itemCode ? purchaseDetail.itemCode : ""
                      }
                      onChangeText={(text) => {
                        setPurchaseDetail({
                          ...purchaseDetail,
                          itcmCode: text,
                        });
                      }}
                      style={[styles.voucherInput]}
                      placeholder="Code"
                    />
                  </View>
                  <View style={styles.voucherItem}>
                    <Text style={styles.dataText}>Item Name</Text>
                    <TextInput
                      value={
                        purchaseDetail.itemName ? purchaseDetail.itemName : ""
                      }
                      onChangeText={(text) => {
                        setPurchaseDetail({
                          ...purchaseDetail,
                          itemName: text,
                        });
                      }}
                      style={[styles.voucherInput]}
                      placeholder="Item Name"
                    />
                  </View>
                  <View style={styles.voucherItem}>
                    <Text style={styles.dataText}>Lot</Text>
                    <TextInput
                      value={purchaseDetail.lot ? purchaseDetail.lot : ""}
                      onChangeText={(text) => {
                        setPurchaseDetail({ ...purchaseDetail, lot: text });
                      }}
                      style={[styles.voucherInput]}
                      placeholder="Lot"
                    />
                  </View>
                  <View style={styles.voucherItem}>
                    <Text style={styles.dataText}>Qty</Text>
                    <TextInput
                      value={purchaseDetail.qty ? purchaseDetail.qty : ""}
                      onChangeText={(text) => {
                        setPurchaseDetail({ ...purchaseDetail, qty: text });
                      }}
                      style={[styles.voucherInput]}
                      placeholder="Qty"
                    />
                  </View>

                  <View style={styles.voucherItem}>
                    <Text style={styles.dataText}>နှုန်း</Text>
                    <TextInput
                      value={purchaseDetail.amount ? purchaseDetail.amount : ""}
                      onChangeText={(text) => {
                        setPurchaseDetail({ ...purchaseDetail, amount: text });
                      }}
                      style={[styles.voucherInput]}
                      placeholder="နှုန်း"
                    />
                  </View>
                  <View style={styles.voucherItem}>
                    <Text style={styles.dataText}>အခွန်</Text>
                    <TextInput
                      value={purchaseDetail.tax ? purchaseDetail.tax : "0"}
                      ref={p10}
                      onChangeText={(text) => {
                        setPurchaseDetail({ ...purchaseDetail, tax: text });
                      }}
                      style={[styles.voucherInput]}
                      placeholder="အခွန်"
                    />
                  </View>
                  <View style={styles.voucherItem}>
                    <Text style={styles.dataText}>လျော့ငွေ</Text>
                    <TextInput
                      value={
                        purchaseDetail.discount ? purchaseDetail.discount : "0"
                      }
                      onChangeText={(text) => {
                        setPurchaseDetail({
                          ...purchaseDetail,
                          discount: text,
                        });
                      }}
                      style={[styles.voucherInput]}
                      placeholder="လျော့ငွေ"
                    />
                  </View>
                  <View style={styles.voucherItem}>
                    <Text style={styles.dataText}>စုစုပေါင်း</Text>
                    <TextInput
                      value={purchaseDetail.total ? purchaseDetail.total : ""}
                      onChangeText={(text) => {
                        setPurchaseDetail({ ...purchaseDetail, total: text });
                      }}
                      style={[styles.voucherInput]}
                      placeholder="စုစုပေါင်း"
                    />
                  </View>
                  <View style={styles.voucherItem}>
                    <Text style={styles.dataText}>ကျန်ငွေ</Text>
                    <TextInput
                      value={
                        purchaseDetail.remain ? purchaseDetail.remain : "0"
                      }
                      onChangeText={(text) => {
                        setPurchaseDetail({ ...purchaseDetail, remain: text });
                      }}
                      style={[styles.voucherInput]}
                      placeholder="ကျန်ငွေ"
                    />
                  </View>
                  <View style={styles.voucherItem}>
                    <Text style={styles.dataText}>အပျက်/ပြန်လဲ</Text>
                    <TextInput
                      value={
                        purchaseDetail.damage ? purchaseDetail.damage : "0"
                      }
                      onChangeText={(text) => {
                        setPurchaseDetail({ ...purchaseDetail, damage: text });
                      }}
                      style={[styles.voucherInput]}
                      placeholder="အပျက်/ပြန်လဲ"
                    />
                  </View>
                </ScrollView>
                {error && (
                  <TouchableOpacity
                    onPress={() => {
                      setError(false);
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 10,
                        fontWeight: "bold",
                        color: "orange",
                      }}
                    >
                      {error}
                    </Text>
                  </TouchableOpacity>
                )}
                {success && (
                  <TouchableOpacity
                    onPress={() => {
                      setsuccess(false);
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 10,
                        fontWeight: "bold",
                        color: "green",
                      }}
                    >
                      အောင်မြင်သည်
                    </Text>
                  </TouchableOpacity>
                )}
                <View style={styles.innerModalConfirm}>
                  <TouchableOpacity
                    style={[
                      styles.btn1,
                      { marginHorizontal: 10, backgroundColor: "#ff00008f" },
                    ]}
                    onPress={() => {
                      purchaseDetail.delete = "true";
                      let p = purchaseDetail;
                      purchaseFunction(p);
                      setsuccess(false);
                      setError();
                      setDelOrEditPurchase(false);
                    }}
                  >
                    <Text style={styles.dataText}>ဖျက်မည်</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.btn1, { marginHorizontal: 10 }]}
                    onPress={() => {
                      let p = purchaseDetail;
                      purchaseFunction(p);
                      setsuccess(false);
                      setError();
                      setDelOrEditPurchase(false);
                    }}
                  >
                    <Text style={[styles.dataText, { color: "#fff" }]}>
                      သိမ်းမည်
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        )}
      </View>
    );
  };

  const renderSale = () => {
    var idSale = "";
    if ((sale.length + 1).toString().length < 2) {
      idSale = "000" + (sale.length + 1);
    } else if ((sale.length + 1).toString().length < 3) {
      idSale = "00" + (sale.length + 1);
    } else if ((sale.length + 1).toString().length < 4) {
      idSale = "0" + (sale.length + 1);
    } else {
      idSale = sale.length + 1;
    }

    const clearInput = () => {
      s1.current.clear();
      s2.current.clear();
      s3.current.clear();
      s4.current.clear();
      if ((sale.length + 1).toString().length < 2) {
        idSale = "000" + (sale.length + 2);
      } else if ((sale.length + 1).toString().length < 3) {
        idSale = "00" + (sale.length + 2);
      } else if ((sale.length + 1).toString().length < 4) {
        idSale = "0" + (sale.length + 2);
      } else {
        idSale = sale.length + 2;
      }

      // s5.current.clear();
      // s6.current.clear();
      // s7.current.clear();
      // s8.current.clear();
      // s9.current.clear();
      // s10.current.clear();
      // s11.current.clear();
      // s12.current.clear();
      multiSale.itemCode = [];
      multiSale.customer = "";
      multiSale.payment = "";
      multiSale.each = [];
      multiSale.itemName = [];
      multiSale.amount = [];
      multiSale.lot = [];
      multiSale.qty = [];
      multiSale.tax = [];
      multiSale.discount = [];
      multiSale.paid = [];
      multiSale.total = [];
      multiSale.remain = [];
      multiSale.damage = [];
      (multiSale.voucher =
        "HKB_B" +
        branch +
        "_" +
        new Date().toISOString().slice(0, 10) +
        "_" +
        idSale),
        setMultiSale({
          customer: "",
          payment: "",
          each: [],
          itemCode: [],
          itemName: [],
          amount: [],
          lot: [],
          qty: [],
          tax: [],
          discount: [],
          paid: [],
          total: [],
          remain: [],
          voucher:
            "HKB_B" +
            branch +
            "_" +
            new Date().toISOString().slice(0, 10) +
            "_" +
            idSale,
        });
      console.log(multiSale);
    };

    const salefunc = async (s) => {
      setsuccess(false);
      setError();
      setLoading(true);
      await axios
        .post(
          "https://service-manager.hlakabar.com/api/hkb.php?op=multi_sale",
          s
        )
        .then((res) => {
          console.log(res);
          setLoading(false);
          setError();
          setsuccess(true);
          s2.current.focus();
          if (s.delete === "true") {
            setaddSale(false);
            setDelOrEditSale(false);
          }
        })
        .catch((err) => {
          console.log(err);
          clearInput();
          setLoading(false);
          setError(err.message);
        });
      clearInput();
    };

    const saleFunction = async (s) => {
      setsuccess(false);
      setError();
      setLoading(true);
      setSaleDetail({});
      await axios
        .post("https://service-manager.hlakabar.com/api/hkb.php?op=sale", s)
        .then((res) => {
          console.log(res);
          setLoading(false);
          setError();
          setsuccess(true);
          setDelOrEditSale(false);
        })
        .catch((err) => {
          console.log(err);
          setLoading(false);
          setError(err.message);
        });
    };
    return (
      <View style={[styles.addContainer, { flexDirection: "column", flex: 1 }]}>
        <View style={styles.addItemList}>
          <Text
            style={{
              fontWeight: "bold",
              fontSize: 14,
            }}
          >
            Sale List
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
                  setsuccess(false);
                  setError();
                  setSaleDetail({ ...saleDetail, damage: 0 });
                  delete saleDetail.id;
                  multiSale.user = user.name;
                  multiSale.voucher =
                    "HKB-B" +
                    branch +
                    new Date().toISOString().slice(0, 10) +
                    "-" +
                    idSale;
                  setaddSale(true);
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
                    : setSale(filterIt(sale, text.toLowerCase()));
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
                <Picker.Item label="Item Code" value="itemCode" />
                <Picker.Item label="Item Name" value="itemName" />
                <Picker.Item label="Lot No." value="lot" />
                <Picker.Item label="Customer" value="customer" />
                <Picker.Item label="User" value="user" />
              </Picker>
            </View>

            <Text
              style={{
                fontWeight: "bold",
                fontSize: 14,
              }}
            >
              Total Sale Item = {sale.length}
            </Text>
            <TouchableOpacity
              onPress={() => {
                setRefresh(!refresh);
              }}
            >
              <MaterialCommunityIcons name="refresh" size={24} color="black" />
            </TouchableOpacity>
          </View>
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
              <DataTable.Title style={styles.tableTitle}>
                ရက်စွဲ
              </DataTable.Title>
              <DataTable.Title style={styles.tableTitle}>
                ဆိုင်ခွဲ
              </DataTable.Title>
              <DataTable.Title style={styles.tableTitle}>
                ဘောက်ချာ
              </DataTable.Title>
              <DataTable.Title style={styles.tableTitle}>ကုတ်</DataTable.Title>
              <DataTable.Title style={styles.tableTitle}>
                ပစ္စည်းအမည်
              </DataTable.Title>
              <DataTable.Title style={styles.tableTitle}>
                လော့နံပါတ်
              </DataTable.Title>
              <DataTable.Title style={styles.tableTitle}>User</DataTable.Title>

              <DataTable.Title style={styles.tableTitle}>
                ဖောက်သည်
              </DataTable.Title>
              <DataTable.Title style={styles.tableTitle}>
                ငွေချေပုံ
              </DataTable.Title>
              <DataTable.Title style={styles.tableTitle}>Qty</DataTable.Title>
              <DataTable.Title style={styles.tableTitle}>
                နှုန်း
              </DataTable.Title>
              <DataTable.Title style={styles.tableTitle}>
                လျော့ငွေ
              </DataTable.Title>
              <DataTable.Title style={styles.tableTitle}>အခွန်</DataTable.Title>
              <DataTable.Title style={styles.tableTitle}>
                ပေးငွေ
              </DataTable.Title>
              <DataTable.Title style={styles.tableTitle}>
                စုစုပေါင်း
              </DataTable.Title>
              <DataTable.Title style={styles.tableTitle}>
                ကျန်ငွေ
              </DataTable.Title>

              <DataTable.Title
                style={[styles.tableTitle, { borderRightWidth: 0 }]}
              >
                အပျက်/ပြန်လဲ
              </DataTable.Title>
            </DataTable.Header>

            <ScrollView
              style={{
                width: "100%",
                flex: 1,
                borderWidth: 1,
                borderBottomWidth: 0,
              }}
              showsVerticalScrollIndicator={false}
            >
              {sale != [] &&
                sale.map((sale, index) => {
                  return (
                    <DataTable.Row
                      key={sale.id}
                      onPress={() => {
                        setSaleDetail({
                          ...sale,
                          pqty: sale.qty,
                          ptotal: sale.total,
                          ppaid: sale.paid,
                          pdamage: sale.damage,
                          pdate: sale.date,
                        });
                        setDelOrEditSale(true);
                      }}
                      style={{
                        backgroundColor: index % 2 === 0 ? "#fff" : "#dedede",
                      }}
                    >
                      <View style={styles.tableTitle}>
                        <Text style={styles.dataText} numberOfLines={3}>
                          {sale.date}
                        </Text>
                      </View>
                      <View style={styles.tableTitle}>
                        <Text style={styles.dataText} numberOfLines={3}>
                          {sale.branch}
                        </Text>
                      </View>
                      <View style={styles.tableTitle}>
                        <Text style={styles.dataText} numberOfLines={3}>
                          {sale.voucher}
                        </Text>
                      </View>
                      <View style={styles.tableTitle}>
                        <Text style={styles.dataText} numberOfLines={3}>
                          {sale.itemCode}
                        </Text>
                      </View>
                      <View style={styles.tableTitle}>
                        <Text style={styles.dataText} numberOfLines={3}>
                          {sale.itemName}
                        </Text>
                      </View>
                      <View style={styles.tableTitle}>
                        <Text style={styles.dataText} numberOfLines={3}>
                          {sale.lot}
                        </Text>
                      </View>
                      <View style={styles.tableTitle}>
                        <Text style={styles.dataText} numberOfLines={3}>
                          {sale.user}
                        </Text>
                      </View>
                      <View style={styles.tableTitle}>
                        <Text style={styles.dataText} numberOfLines={3}>
                          {sale.customer}
                        </Text>
                      </View>
                      <View style={styles.tableTitle}>
                        <Text style={styles.dataText} numberOfLines={3}>
                          {sale.payment}
                        </Text>
                      </View>
                      <View style={styles.tableTitle}>
                        <Text style={styles.dataText} numberOfLines={3}>
                          {sale.qty}
                        </Text>
                      </View>
                      <View style={styles.tableTitle}>
                        <Text style={styles.dataText} numberOfLines={3}>
                          <NumberFormat
                            value={sale.amount}
                            displayType={"text"}
                            thousandSeparator={true}
                          />
                        </Text>
                      </View>
                      <View style={styles.tableTitle}>
                        <Text style={styles.dataText} numberOfLines={3}>
                          {sale.discount}
                        </Text>
                      </View>
                      <View style={styles.tableTitle}>
                        <Text style={styles.dataText} numberOfLines={3}>
                          {sale.tax}
                        </Text>
                      </View>
                      <View style={styles.tableTitle}>
                        <Text style={styles.dataText} numberOfLines={3}>
                          <NumberFormat
                            value={sale.paid}
                            displayType={"text"}
                            thousandSeparator={true}
                          />
                        </Text>
                      </View>
                      <View style={styles.tableTitle}>
                        <Text style={styles.dataText} numberOfLines={3}>
                          <NumberFormat
                            value={sale.total}
                            displayType={"text"}
                            thousandSeparator={true}
                          />
                        </Text>
                      </View>
                      <View style={styles.tableTitle}>
                        <Text style={styles.dataText} numberOfLines={3}>
                          <NumberFormat
                            value={sale.remain}
                            displayType={"text"}
                            thousandSeparator={true}
                          />
                        </Text>
                      </View>
                      <View
                        style={[styles.tableTitle, { borderRightWidth: 0 }]}
                      >
                        <Text style={styles.dataText} numberOfLines={3}>
                          {sale.damage}
                        </Text>
                      </View>
                    </DataTable.Row>
                  );
                })}
            </ScrollView>
            <DataTable.Row
              style={{
                backgroundColor: "#6836838f",
                borderWidth: 1,
              }}
            >
              <View style={styles.tableTitle}>
                <Text style={styles.dataText} numberOfLines={3}>
                  Qty ={" "}
                  {sale != [] &&
                    sale.reduce((a, b) => {
                      return a + b.qty;
                    }, 0)}
                </Text>
              </View>
              <View style={styles.tableTitle}>
                <Text style={styles.dataText} numberOfLines={3}>
                  လျော့ငွေ ={" "}
                  <NumberFormat
                    value={
                      sale != [] &&
                      sale.reduce((a, b) => {
                        return a + b.discount;
                      }, 0)
                    }
                    displayType={"text"}
                    thousandSeparator={true}
                  />
                </Text>
              </View>
              <View style={styles.tableTitle}>
                <Text style={styles.dataText} numberOfLines={3}>
                  အခွန် ={" "}
                  {sale != [] &&
                    sale.reduce((a, b) => {
                      return a + b.tax;
                    }, 0)}
                </Text>
              </View>
              <View style={styles.tableTitle}>
                <Text style={styles.dataText} numberOfLines={3}>
                  ပေးငွေ ={" "}
                  <NumberFormat
                    value={
                      sale != [] &&
                      sale.reduce((a, b) => {
                        return a + b.paid;
                      }, 0)
                    }
                    displayType={"text"}
                    thousandSeparator={true}
                  />
                </Text>
              </View>
              <View style={styles.tableTitle}>
                <Text style={styles.dataText} numberOfLines={3}>
                  စုစုပေါင်း ={" "}
                  <NumberFormat
                    value={
                      sale != [] &&
                      sale.reduce((a, b) => {
                        return a + b.total;
                      }, 0)
                    }
                    displayType={"text"}
                    thousandSeparator={true}
                  />
                </Text>
              </View>
              <View style={styles.tableTitle}>
                <Text style={styles.dataText} numberOfLines={3}>
                  ကျန်ငွေ ={" "}
                  {sale != [] &&
                    sale.reduce((a, b) => {
                      return a + b.remain;
                    }, 0)}
                </Text>
              </View>
              <View style={[styles.tableTitle, { borderRightWidth: 0 }]}>
                <Text style={styles.dataText} numberOfLines={3}>
                  အပျက်/ပြန်လဲ ={" "}
                  {sale != [] &&
                    sale.reduce((a, b) => {
                      return a + b.damage;
                    }, 0)}
                </Text>
              </View>
            </DataTable.Row>
          </DataTable>
        </View>
        {addSale && (
          <View style={styles.modalView}>
            <TouchableOpacity
              style={{ right: 20, top: 20, position: "absolute" }}
              onPress={() => {
                setMultiSale({
                  each: [],
                  itemCode: [],
                  itemName: [],
                  amount: [],
                  lot: [],
                  qty: [],
                  tax: [],
                  discount: [],
                  paid: [],
                  total: [],
                  remain: [],
                });
                setsuccess(false);
                setError();
                setaddSale(false);
              }}
            >
              <MaterialCommunityIcons
                name="close-circle"
                size={24}
                color="#683683"
              />
            </TouchableOpacity>
            <View style={styles.saleModal}>
              <ScrollView
                showsVerticalScrollIndicator={false}
                style={{
                  width: "100%",
                  height: "100%",
                  flex: 1,
                  paddingHorizontal: 10,
                  paddingVertical: 20,
                }}
                contentContainerStyle={{
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <View style={styles.voucherItem}>
                  <Text style={styles.dataText}>ဘောက်ချာ</Text>
                  <TextInput
                    ref={s2}
                    value={multiSale.voucher ? multiSale.voucher : ""}
                    onChangeText={(text) => {
                      setMultiSale({ ...multiSale, voucher: text });
                    }}
                    style={[styles.voucherInput]}
                    placeholder="ဘောက်ချာ"
                  />
                </View>
                <View style={styles.voucherItem}>
                  <Text style={styles.dataText}>အမည်</Text>
                  <TextInput
                    ref={s3}
                    onChangeText={(text) => {
                      setMultiSale({ ...multiSale, customer: text });
                    }}
                    style={[styles.voucherInput]}
                    placeholder="အမည်"
                  />
                </View>
                <View style={styles.voucherItem}>
                  <Text style={styles.dataText}>ငွေချေပုံ</Text>
                  <TextInput
                    ref={s4}
                    onChangeText={(text) => {
                      setMultiSale({ ...multiSale, payment: text });
                    }}
                    style={[styles.voucherInput]}
                    placeholder="ငွေချေပုံ"
                  />
                </View>
                <View style={styles.voucherItem}>
                  <Text style={styles.dataText}>Code </Text>
                  <TextInput
                    ref={s1}
                    onKeyPress={(e) => {
                      if (e.nativeEvent.key === "Enter") {
                        const result = item.find(
                          ({ itemCode }) => itemCode === s1.current.value
                        );
                        setVoucherLoad(voucherLoad + 1);
                        if (result) {
                          if (result.total <= 0) {
                            setError("Not Enough Item");
                          } else {
                            multiSale.itemCode.push(result.itemCode);
                            multiSale.itemName.push(result.itemName);
                            multiSale.amount.push(parseInt(result.sellPrice));

                            multiSale.lot.push(result.lot);
                            multiSale.qty.push(1);
                            multiSale.tax.push(0);
                            multiSale.discount.push(0);
                            multiSale.paid.push(parseInt(result.sellPrice));
                            multiSale.total.push(parseInt(result.sellPrice));
                            multiSale.remain.push(0);
                            multiSale.each.push(parseInt(result.sellPrice));
                          }
                        } else {
                          setError("No Item Found");
                        }
                      }
                    }}
                    style={[styles.voucherInput]}
                    placeholder="code"
                  />
                </View>
                {multiSale.itemCode != [] &&
                  multiSale.itemCode.map((code, i) => {
                    console.log(multiSale);
                    return (
                      <View style={styles.voucherItem} key={code}>
                        <Text style={styles.dataText}>
                          {multiSale.itemName != []
                            ? multiSale.itemName[i]
                            : "ပစ္စည်းအမည်"}
                        </Text>
                        <Text style={styles.dataText}>
                          {multiSale.lot != []
                            ? "Lot-" + multiSale.lot[i]
                            : "လော့နံပါတ်"}
                        </Text>
                        <View
                          style={{
                            flexDirection: "row",
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        >
                          <TouchableOpacity
                            onPress={() => {
                              let q = multiSale.qty[i] - 1;
                              let t =
                                multiSale.amount[i] * q +
                                (multiSale.tax[i] - multiSale.discount[i]);
                              multiSale.total[i] = t;
                              multiSale.paid[i] = t;
                              multiSale.qty[i] = q;
                              if (q === 0) {
                                multiSale.itemCode.splice(i, 1);
                                multiSale.qty.splice(i, 1);

                                multiSale.itemName.splice(i, 1);
                                multiSale.amount.splice(i, 1);
                                multiSale.lot.splice(i, 1);
                                multiSale.tax.splice(i, 1);
                                multiSale.discount.splice(i, 1);
                                multiSale.paid.splice(i, 1);
                                multiSale.total.splice(i, 1);
                                multiSale.remain.splice(i, 1);
                                multiSale.each.splice(i, 1);
                              }
                              setVoucherLoad(voucherLoad - 1);
                            }}
                          >
                            <MaterialCommunityIcons
                              name="arrow-left-drop-circle"
                              size={20}
                              color="#fff"
                            />
                          </TouchableOpacity>
                          <Text
                            style={[styles.dataText, { marginHorizontal: 2 }]}
                          >
                            {multiSale.qty != [] ? multiSale.qty[i] : "Qty."}
                          </Text>
                          <TouchableOpacity
                            onPress={() => {
                              let q = multiSale.qty[i] + 1;

                              const result = item.find(
                                ({ itemCode }) =>
                                  itemCode === multiSale.itemCode[i]
                              );
                              if (q > result.total) {
                                setError("Not Enough Item");
                              } else {
                                let t =
                                  multiSale.amount[i] * q +
                                  (multiSale.tax[i] - multiSale.discount[i]);
                                multiSale.total[i] = t;
                                multiSale.paid[i] = t;
                                multiSale.qty[i] = q;
                                setVoucherLoad(voucherLoad + 1);
                              }
                            }}
                          >
                            <MaterialCommunityIcons
                              name="arrow-right-drop-circle"
                              size={20}
                              color="#fff"
                            />
                          </TouchableOpacity>
                        </View>

                        <TextInput
                          value={multiSale.amount[i]}
                          onChangeText={(text) => {
                            setVoucherLoad(voucherLoad + 1);
                            let a = text;
                            multiSale.amount[i] = a;
                            multiSale.each[i] =
                              multiSale.qty[i] * parseInt(text);

                            let q = multiSale.qty[i];
                            let t =
                              a * q +
                              (multiSale.tax[i] - multiSale.discount[i]);
                            multiSale.total[i] = t;
                            multiSale.paid[i] = t;

                            setVoucherLoad(voucherLoad - 1);
                          }}
                          style={[styles.voucherInput, { width: 70 }]}
                          placeholder="နှုန်း"
                        />
                        <TextInput
                          ref={s5}
                          value={
                            multiSale.qty != [] && multiSale.amount != []
                              ? multiSale.qty[i] * multiSale.amount[i]
                              : "0"
                          }
                          style={[styles.voucherInput, { width: 75 }]}
                          placeholder="စုစုပေါင်း"
                        />
                      </View>
                    );
                  })}

                <View style={styles.voucherItem}>
                  <Text style={styles.dataText}>အခွန်</Text>
                  <TextInput
                    ref={s6}
                    value={
                      multiSale.tax
                        ? multiSale.tax.reduce((a, b) => a + b, 0)
                        : ""
                    }
                    style={[styles.voucherInput]}
                    placeholder="အခွန်"
                    onChangeText={(text) => {
                      setVoucherLoad(voucherLoad + 1);

                      if (text) {
                        let tax = parseInt(text);
                        for (let i = 0; i < multiSale.tax.length; i++) {
                          let ta = tax / multiSale.tax.length;
                          multiSale.tax[i] = ta;
                          let to =
                            parseInt(multiSale.amount[i]) * multiSale.qty[i] -
                            parseInt(multiSale.discount[i]);
                          let t = to + ta;
                          multiSale.total[i] = t;
                          multiSale.paid[i] = t;
                        }
                      } else {
                        let tax = 0;
                        for (let i = 0; i < multiSale.tax.length; i++) {
                          let ta = tax / multiSale.tax.length;
                          multiSale.tax[i] = ta;
                          let to =
                            parseInt(multiSale.amount[i]) * multiSale.qty[i] -
                            parseInt(multiSale.discount[i]);
                          let t = to + ta;
                          multiSale.total[i] = t;
                          multiSale.paid[i] = t;
                        }
                      }
                      setVoucherLoad(voucherLoad - 1);
                    }}
                  />
                </View>
                <View style={styles.voucherItem}>
                  <Text style={styles.dataText}>လျော့ငွေ</Text>
                  <TextInput
                    ref={s7}
                    value={
                      multiSale.discount
                        ? multiSale.discount.reduce((a, b) => a + b, 0)
                        : ""
                    }
                    style={[styles.voucherInput]}
                    placeholder="လျော့ငွေ"
                    onChangeText={(text) => {
                      setVoucherLoad(voucherLoad + 1);

                      if (text) {
                        let dis = parseInt(text);
                        for (let i = 0; i < multiSale.discount.length; i++) {
                          let di = dis / multiSale.discount.length;
                          multiSale.discount[i] = di;
                          let to =
                            parseInt(multiSale.amount[i]) * multiSale.qty[i] +
                            parseInt(multiSale.tax[i]);
                          let t = to - di;
                          multiSale.total[i] = t;
                          multiSale.paid[i] = t;
                        }
                      } else {
                        let dis = 0;
                        for (let i = 0; i < multiSale.discount.length; i++) {
                          let di = dis / multiSale.discount.length;
                          multiSale.discount[i] = di;
                          let to =
                            parseInt(multiSale.amount[i]) * multiSale.qty[i] +
                            parseInt(multiSale.tax[i]);
                          let t = to - di;
                          multiSale.total[i] = t;
                          multiSale.paid[i] = t;
                        }
                      }
                      setVoucherLoad(voucherLoad - 1);
                    }}
                  />
                </View>
                <View style={styles.voucherItem}>
                  <Text style={styles.dataText}>ပေးငွေ</Text>
                  <TextInput
                    ref={s8}
                    onChangeText={(text) => {
                      setVoucherLoad(voucherLoad + 1);

                      if (text) {
                        let pa = parseInt(text);
                        for (let i = 0; i < multiSale.paid.length; i++) {
                          let p = pa / multiSale.paid.length;
                          multiSale.paid[i] = p;
                          let to = parseInt(multiSale.total[i]);
                          let r = to - p;
                          multiSale.remain[i] = r;
                        }
                      } else {
                        let pa = 0;
                        for (let i = 0; i < multiSale.paid.length; i++) {
                          let p = [a] / multiSale.paid.length;
                          multiSale.paid[i] = p;
                          let to = parseInt(multiSale.total[i]);
                          let r = to - p;
                          multiSale.remain[i] = t;
                        }
                      }
                      setVoucherLoad(voucherLoad - 1);
                    }}
                    // ref={s11}
                    value={
                      multiSale.paid
                        ? multiSale.paid.reduce((a, b) => a + b, 0)
                        : ""
                    }
                    style={[styles.voucherInput]}
                    placeholder="ပေးငွေ"
                  />
                </View>
                <View style={styles.voucherItem}>
                  <Text style={styles.dataText}>စုစုပေါင်း</Text>
                  <TextInput
                    editable={false}
                    ref={s9}
                    value={
                      multiSale.total
                        ? multiSale.total.reduce((a, b) => a + b, 0)
                        : ""
                    }
                    style={[styles.voucherInput]}
                    placeholder="စုစုပေါင်း"
                    onChangeText={(text) => {
                      setMultiSale({ ...multiSale, total: parseInt(text) });
                    }}
                  />
                </View>
                <View style={styles.voucherItem}>
                  <Text style={styles.dataText}>ကျန်ငွေ</Text>
                  <TextInput
                    editable={false}
                    ref={s10}
                    value={
                      multiSale.remain
                        ? multiSale.remain.reduce((a, b) => a + b, 0)
                        : ""
                    }
                    style={[styles.voucherInput]}
                    placeholder="ကျန်ငွေ"
                    onChangeText={(text) => {
                      setMultiSale({ ...multiSale, remain: parseInt(text) });
                    }}
                  />
                </View>
              </ScrollView>
              {error && (
                <TouchableOpacity
                  onPress={() => {
                    setError(false);
                  }}
                >
                  <Text
                    style={{
                      fontSize: 10,
                      fontWeight: "bold",
                      color: "orange",
                    }}
                  >
                    {error}
                  </Text>
                </TouchableOpacity>
              )}
              {success && (
                <TouchableOpacity
                  onPress={() => {
                    setsuccess(false);
                  }}
                >
                  <Text
                    style={{
                      fontSize: 10,
                      fontWeight: "bold",
                      color: "green",
                    }}
                  >
                    အောင်မြင်သည်
                  </Text>
                </TouchableOpacity>
              )}
              <View style={styles.innerModalConfirm}>
                <TouchableOpacity
                  style={[
                    styles.btn1,
                    { marginHorizontal: 10, backgroundColor: "gray" },
                  ]}
                  onPress={() => {
                    setMultiSale({
                      each: [],
                      itemCode: [],
                      itemName: [],
                      amount: [],
                      lot: [],
                      qty: [],
                      tax: [],
                      discount: [],
                      paid: [],
                      total: [],
                      remain: [],
                    });
                    setsuccess(false);
                    setError();
                    setaddSale(false);
                  }}
                >
                  <Text style={styles.dataText}>ပိတ်ပါ</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.btn1, { marginHorizontal: 10 }]}
                  onPress={() => {
                    multiSale.user = user.name;
                    multiSale.branch = branch;
                    if (multiSale.itemCode.length === 0) {
                      setError("No Item Code");
                    } else if (multiSale.itemName.length === 0) {
                      setError("No Item Name/Wrong Item Code");
                    } else if (!multiSale.user) {
                      setError("No User/Login In First");
                    } else if (multiSale.lot.length === 0) {
                      setError("No Lot Number");
                    } else if (!multiSale.customer) {
                      setError("No Customer");
                    } else if (!multiSale.voucher) {
                      setError("No Voucher");
                    } else if (multiSale.qty.length === 0) {
                      setError("No Qty");
                    } else if (multiSale.amount.length === 0) {
                      setError("No Amount");
                    } else if (multiSale.discount.length === 0) {
                      setError("No Discount");
                    } else if (multiSale.tax.length === 0) {
                      setError("No Tax");
                    } else if (multiSale.paid.length === 0) {
                      setError("No Paid");
                    } else if (multiSale.total.length === 0) {
                      setError("No Total");
                    } else if (multiSale.remain.length === 0) {
                      setError("No Remain");
                    } else {
                      let s = multiSale;
                      salefunc(s);
                    }
                  }}
                >
                  <Text style={[styles.dataText, { color: "#fff" }]}>
                    သိမ်းမည်
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
            <View></View>
          </View>
        )}
        {delOrEditSale && (
          <View style={styles.modalView}>
            <TouchableOpacity
              style={{ right: 20, top: 20, position: "absolute" }}
              onPress={() => {
                setaddSale(false);
                setDelOrEditSale(false);
                setsuccess(false);
                setError();
                delete saleDetail.id;
                setRefresh(!refresh);
                setSaleDetail({});
              }}
            >
              <MaterialCommunityIcons
                name="close-circle"
                size={24}
                color="#683683"
              />
            </TouchableOpacity>
            <View style={styles.saleModal}>
              <View style={styles.saleModal}>
                <ScrollView
                  showsVerticalScrollIndicator={false}
                  style={{
                    width: "100%",
                    height: "100%",
                    flex: 1,
                    paddingHorizontal: 10,
                    paddingVertical: 20,
                  }}
                  contentContainerStyle={{
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text style={styles.headerText}> အရောင်းစာရင်း </Text>
                  <View style={styles.voucherItem}>
                    <Text style={styles.dataText}>ဘောက်ချာ</Text>
                    <TextInput
                      value={saleDetail.voucher ? saleDetail.voucher : ""}
                      onChangeText={(text) => {
                        setSaleDetail({ ...saleDetail, voucher: text });
                      }}
                      style={[styles.voucherInput]}
                      placeholder="ဘောက်ချာ"
                    />
                  </View>
                  <View style={styles.voucherItem}>
                    <Text style={styles.dataText}>ဖောက်သည်</Text>
                    <TextInput
                      value={saleDetail.customer ? saleDetail.customer : ""}
                      onChangeText={(text) => {
                        setSaleDetail({
                          ...saleDetail,
                          supplier: text,
                        });
                      }}
                      style={[styles.voucherInput]}
                      placeholder="ဖောက်သည်"
                    />
                  </View>
                  <View style={styles.voucherItem}>
                    <Text style={styles.dataText}>Payment</Text>
                    <TextInput
                      value={saleDetail.payment ? saleDetail.payment : ""}
                      onChangeText={(text) => {
                        setSaleDetail({ ...saleDetail, payment: text });
                      }}
                      style={[styles.voucherInput]}
                      placeholder="Payment"
                    />
                  </View>
                  <View style={styles.voucherItem}>
                    <Text style={styles.dataText}>Code</Text>
                    <TextInput
                      value={saleDetail.itemCode ? saleDetail.itemCode : ""}
                      onChangeText={(text) => {
                        setSaleDetail({
                          ...saleDetail,
                          itcmCode: text,
                        });
                      }}
                      style={[styles.voucherInput]}
                      placeholder="Code"
                    />
                  </View>
                  <View style={styles.voucherItem}>
                    <Text style={styles.dataText}>Item Name</Text>
                    <TextInput
                      value={saleDetail.itemName ? saleDetail.itemName : ""}
                      onChangeText={(text) => {
                        setSaleDetail({
                          ...saleDetail,
                          itemName: text,
                        });
                      }}
                      style={[styles.voucherInput]}
                      placeholder="Item Name"
                    />
                  </View>
                  <View style={styles.voucherItem}>
                    <Text style={styles.dataText}>Lot</Text>
                    <TextInput
                      value={saleDetail.lot ? saleDetail.lot : ""}
                      onChangeText={(text) => {
                        setSaleDetail({ ...setSaleDetail, lot: text });
                      }}
                      style={[styles.voucherInput]}
                      placeholder="Lot"
                    />
                  </View>
                  <View style={styles.voucherItem}>
                    <Text style={styles.dataText}>Qty</Text>
                    <TextInput
                      value={saleDetail.qty ? saleDetail.qty : ""}
                      onChangeText={(text) => {
                        setSaleDetail({ ...saleDetail, qty: text });
                      }}
                      style={[styles.voucherInput]}
                      placeholder="Qty"
                    />
                  </View>

                  <View style={styles.voucherItem}>
                    <Text style={styles.dataText}>နှုန်း</Text>
                    <TextInput
                      value={saleDetail.amount ? saleDetail.amount : ""}
                      onChangeText={(text) => {
                        setSaleDetail({ ...saleDetail, amount: text });
                      }}
                      style={[styles.voucherInput]}
                      placeholder="နှုန်း"
                    />
                  </View>
                  <View style={styles.voucherItem}>
                    <Text style={styles.dataText}>အခွန်</Text>
                    <TextInput
                      value={saleDetail.tax ? saleDetail.tax : "0"}
                      ref={p10}
                      onChangeText={(text) => {
                        setSaleDetail({ ...saleDetail, tax: text });
                      }}
                      style={[styles.voucherInput]}
                      placeholder="အခွန်"
                    />
                  </View>
                  <View style={styles.voucherItem}>
                    <Text style={styles.dataText}>လျော့ငွေ</Text>
                    <TextInput
                      value={saleDetail.discount ? saleDetail.discount : "0"}
                      onChangeText={(text) => {
                        setSaleDetail({
                          ...saleDetail,
                          discount: text,
                        });
                      }}
                      style={[styles.voucherInput]}
                      placeholder="လျော့ငွေ"
                    />
                  </View>
                  <View style={styles.voucherItem}>
                    <Text style={styles.dataText}>စုစုပေါင်း</Text>
                    <TextInput
                      value={saleDetail.total ? saleDetail.total : ""}
                      onChangeText={(text) => {
                        setSaleDetail({ ...saleDetail, total: text });
                      }}
                      style={[styles.voucherInput]}
                      placeholder="စုစုပေါင်း"
                    />
                  </View>
                  <View style={styles.voucherItem}>
                    <Text style={styles.dataText}>ကျန်ငွေ</Text>
                    <TextInput
                      value={saleDetail.remain ? saleDetail.remain : "0"}
                      onChangeText={(text) => {
                        setSaleDetail({ ...saleDetail, remain: text });
                      }}
                      style={[styles.voucherInput]}
                      placeholder="ကျန်ငွေ"
                    />
                  </View>
                  <View style={styles.voucherItem}>
                    <Text style={styles.dataText}>အပျက်/ပြန်လဲ</Text>
                    <TextInput
                      value={saleDetail.damage ? saleDetail.damage : "0"}
                      onChangeText={(text) => {
                        setSaleDetail({ ...saleDetail, damage: text });
                      }}
                      style={[styles.voucherInput]}
                      placeholder="အပျက်/ပြန်လဲ"
                    />
                  </View>
                </ScrollView>
                {error && (
                  <TouchableOpacity
                    onPress={() => {
                      setError(false);
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 10,
                        fontWeight: "bold",
                        color: "orange",
                      }}
                    >
                      {error}
                    </Text>
                  </TouchableOpacity>
                )}
                {success && (
                  <TouchableOpacity
                    onPress={() => {
                      setsuccess(false);
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 10,
                        fontWeight: "bold",
                        color: "green",
                      }}
                    >
                      အောင်မြင်သည်
                    </Text>
                  </TouchableOpacity>
                )}
                <View style={styles.innerModalConfirm}>
                  <TouchableOpacity
                    style={[
                      styles.btn1,
                      { marginHorizontal: 10, backgroundColor: "#ff00008f" },
                    ]}
                    onPress={() => {
                      saleDetail.delete = "true";
                      let s = saleDetail;
                      saleFunction(s);
                      setsuccess(false);
                      setError();
                      setDelOrEditSale(false);
                    }}
                  >
                    <Text style={styles.dataText}>ဖျက်မည်</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.btn1, { marginHorizontal: 10 }]}
                    onPress={() => {
                      let s = saleDetail;
                      saleFunction(s);
                      setsuccess(false);
                      setError();
                      setDelOrEditSale(false);
                    }}
                  >
                    <Text style={[styles.dataText, { color: "#fff" }]}>
                      သိမ်းမည်
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        )}
      </View>
    );
  };

  return (
    <View style={styles.inventory}>
      <View style={styles.header}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <MaterialCommunityIcons
            name="file-table-box-multiple"
            size={24}
            color="#eee"
          />
          <Text style={styles.headerText}>Inventory Management</Text>
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
        <View style={{ flexDirection: "row" }}>
          {btnData &&
            btnData.map((btnDatas) => {
              return (
                <TouchableOpacity
                  key={btnDatas}
                  onPress={() => {
                    setChosen(btnDatas);
                    setScreen(btnDatas);
                  }}
                  style={
                    chosen != btnDatas
                      ? [
                          styles.btn,
                          {
                            backgroundColor: "#ffffff5f",
                          },
                        ]
                      : styles.btn
                  }
                >
                  <Text style={styles.btnText}>{btnDatas}</Text>
                </TouchableOpacity>
              );
            })}
        </View>
      </View>
      <View style={styles.body}>
        {screen == "Sale" && renderSale()}
        {screen == "Purchase" && renderPurchase()}
        {screen == "Stock" && renderStock()}
        {screen == "Item" && renderItem()}
      </View>
    </View>
  );
};

export default Inventory;

const styles = StyleSheet.create({
  codeDisplay: {
    flexDirection: "row",
    paddingHorizontal: 5,
    paddingVertical: 3,
    backgroundColor: "#ffffff8f",
    borderRadius: 3,
    justifyContent: "space-between",
    alignItems: "center",
  },
  saleModal: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#6836838f",
    width: 600,
    borderRadius: 10,
    padding: 10,
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

  inventory: {
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
  inputContainer: {
    flexDirection: "row",
    width: "100%",
    marginTop: 5,
    justifyContent: "center",
    alignItems: "center",
  },
  inputText: {
    flex: 1,
    fontSize: 12,
    fontWeight: "bold",
  },
  input: {
    flex: 1,
    paddingVertical: 3,
    paddingHorizontal: 5,
    borderWidth: 1,
    marginLeft: 5,
    textAlign: "right",
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
  input2: {
    backgroundColor: "#fff",
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "right",
    fontWeight: "bold",
    fontSize: 18,
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
  tableTitle: {
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
    borderRightWidth: 1,
    paddingHorizontal: 5,
    paddingVertical: 10,
  },
  dataText: {
    fontSize: 12,
    fontWeight: "bold",
    textAlign: "center",
    fontWeight: "bold",
    textAlignVertical: "center",
  },
  modalView: {
    position: "absolute",
    backgroundColor: "#000000ee",
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  innerModal: {
    width: "100%",
    height: 200,
    position: "relative",
    paddingHorizontal: 5,
    paddingVertical: 10,
    backgroundColor: "#ffffff00",
    alignItems: "center",
  },
  innerModalConfirm: {
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
});
