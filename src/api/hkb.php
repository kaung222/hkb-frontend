<?php
header("Access-Control-Allow-Headers: Content-Type, Accept, Authorization, X-Requested-With, X-Auth-Token, Origin, Application");
header("Access-Control-Allow-Origin:  *");
header('Content-type: text/html; charset=utf-8');
date_default_timezone_set('Asia/Yangon'); 

$db = mysqli_connect('localhost', 'hlakabar_service', '06321421nma06321421nma') or die("Error in Connect DB " . mysqli_error($db));
$db->set_charset("utf8");

$EncodedData = file_get_contents('php://input');
$DecodedData =  json_decode($EncodedData, true);

if(isset($_GET['op'])) {
    $op = $_GET['op'];
    switch ($op) {
        default:
        notFound();
        break;
        
        // case 'create':
        //     create();
        //     break;
        
        case 'saveItem':
            saveItem();
            break;

        case 'getItem':
            getItem();
            break;

        case 'purchase':
            purchase();
            break;

        case 'multi_purchase':
            multiPurchase();
            break;

            case 'multi_sale':
                multiSale();
                break;

        case 'sale':
            sale();
            break;

        case 'getcash':
            getcash();
            break;

        case 'cash':
           cash();
            break;

        case 'getService':
            getService();
            break;

        case 'addService':
            addService();
            break;
        
        case 'getDebt':
            getDebt();
            break;

        case 'debt':
            debt();
            break;
            
         case 'getInfo':
            getInfo();
            break;
      }
    }
    
    function getInfo(){
        phpinfo();
    }

    function addService(){
        global $DecodedData;
        $db = mysqli_connect('localhost', 'hlakabar_service', '06321421nma06321421nma', 'hlakabar_hkb') or die("Error in Connect DB " . mysqli_error($db));
        if ( isset($DecodedData['branch']) && isset($DecodedData['user']) &&isset($DecodedData['customer']) &&isset($DecodedData['voucher']) &&isset($DecodedData['phone']) &&isset($DecodedData['brand']) &&isset($DecodedData['model']) &&isset($DecodedData['imei']) &&isset($DecodedData['color']) &&isset($DecodedData['error']) &&isset($DecodedData['remark'])  &&isset($DecodedData['due_date'])  &&isset($DecodedData['warranty']) && isset($DecodedData['progress']) &&isset($DecodedData['engineer']) &&isset($DecodedData['service_reply']) && isset($DecodedData['item']) &&isset($DecodedData['service_charges']) &&isset($DecodedData['expense']) && isset($DecodedData['paid'])  && isset($DecodedData['service_return']) && isset($DecodedData['condition']) && isset($DecodedData['return_date']) && isset($DecodedData['is_retrieved']) ){
            $branch = $DecodedData['branch'];
            $user = $DecodedData['user'];
            $customer = $DecodedData['customer'];
            $voucher = $DecodedData['voucher'];
            $phone = $DecodedData['phone'];
            $brand = $DecodedData['brand'];
            $model = $DecodedData['model'];
            $imei = $DecodedData['imei'];
            $color = $DecodedData['color'];
            $error =  $DecodedData['error'];
            $remark =  $DecodedData['remark'];
            $condition = $DecodedData['condition'];
            $service_return = $DecodedData['service_return'];
            $due_date = $DecodedData['due_date'];
            $warranty = $DecodedData['warranty'];
            $progress = $DecodedData['progress'];
            $engineer = $DecodedData['engineer'];
           $service_reply =$DecodedData['service_reply'];
            $item = $DecodedData['item'];
            $service_charges = (int)$DecodedData['service_charges'];
            $expense = (int)$DecodedData['expense'];
            $paid = (int)$DecodedData['paid'];
            $return_date= $DecodedData['return_date'];
            $remain = $service_charges-$paid;
            $profit = $service_charges-$expense;
            $is_retrieved = (int)$DecodedData['is_retrieved'];
            if(isset($DecodedData['delete'])){
                $id = $DecodedData['id'];
                $pdate = $DecodedData['pdate'];
                $pservice_charges = $DecodedData['pservice_charges'];
                $ppaid = $DecodedData['ppaid'];
                $pexpense = $DecodedData['pexpense'];
                $pprofit = $pservice_charges-$pexpense;
                $sql = "DELETE FROM `service` WHERE id=$id";
                $sql_cash= "UPDATE cash SET `service`=`service`-$pprofit  WHERE gg=concat('Branch_','$branch','  Date - ',date('$pdate'))";
                $sql_debt = "DELETE FROM debt  WHERE debtId=$id";
            } 
            else if(isset($DecodedData['id'])) {
                $id = $DecodedData['id'];
                $pdate = $DecodedData['pdate'];
                $pservice_charges = $DecodedData['pservice_charges'];
                $ppaid = $DecodedData['ppaid'];
                $pexpense = $DecodedData['pexpense'];
                // $pprofit = $pservice_charges-$pexpense;
                // $premain = $pservice_charges - $ppaid;
                $pprofit = $service_charges - $expense;
                $premain = $service_charges - $paid;
                if( $DecodedData['return'] == "true"  ){
                    $sql = "UPDATE `service`  SET return_date=NOW() where id=$id";
                } else {
                    $sql = "UPDATE `service` SET 
                    branch =  '$branch' ,
                    user = '$user' ,
                    customer =  '$customer',
                    voucher = '$voucher',
                    phone = '$phone',
                    brand = '$brand',
                    model ='$model',
                    imei = '$imei',
                    color = '$color',
                    error = '$error',
                    remark = '$remark',
                    `condition` = '$condition',
                    service_return = '$service_return',
                    due_date = '$due_date',
                    warranty = '$warranty',
                    progress = '$progress',
                    engineer = '$engineer',
                    service_reply = '$service_reply' ,
                    item = '$item',
                    service_charges = $service_charges,
                    expense =$expense,
                    paid = $paid,
                    -- remain =remain-$premain+$remain,
                    -- profit=profit-$pprofit+$profit    
                    remain =$premain,
                    profit=$pprofit,
                    is_retrieved = $is_retrieved,
                    retrieved_date = " . ($is_retrieved ? "NOW()" : "NULL") . ",
                     `date` = NOW() 
                     WHERE id=$id";
                } 
                $sql_cash="INSERT INTO cash (gg,`service` ,`date`,branch) VALUES (concat('Branch_',$branch,'  Date - ',curdate()) ,$profit-$pprofit, curdate(),$branch)
                ON DUPLICATE KEY UPDATE `service`=`service`+$profit-$pprofit;"; 
                // $sql_cash= "UPDATE cash SET `service`=`service`-$pprofit+$profit  WHERE gg=concat('Branch_','$branch','  Date - ',date('$pdate'))";
                $sql_debt = "UPDATE debt SET  yayan=yayan-$premain+$remain WHERE debtId=$id";
            }else{
                $sql_cash="INSERT INTO cash (gg,`service` ,`date`,branch) VALUES (concat('Branch_',$branch,'  Date - ',curdate()) ,$profit, curdate(),$branch)
                ON DUPLICATE KEY UPDATE `service`=`service`+$profit;"; 
                $sql = "INSERT INTO  `service`  (branch , user , customer , phone , voucher , brand , model  , imei , color , error , remark , `date` ,service_return , due_date , `condition` , return_date , warranty , progress , engineer , service_reply , item , service_charges , expense , paid , remain , profit) VALUE ('$branch' , '$user' , '$customer' , '$phone' , '$voucher' , '$brand' , '$model' , '$imei' ,'$color', '$error', '$remark', NOW(), '$service_return', '$due_date', '$condition', '$return_date', '$warranty', '$progress', '$engineer', '$service_reply', '$item', '$service_charges', '$expense', '$paid', '$remain' , '$profit','$is_retrieved, " . ($is_retrieved ? "NOW()" : "NULL") . ");";
                if($remain != 0){
                $sql_debt = "INSERT INTO debt (debtId , `name` ,payyan , yayan , voucher , `description` ,`date` , branch ) SELECT id , '$customer' , 0 ,$remain ,  '$voucher' ,'service', date , branch  FROM `service` ORDER by id desc  LIMIT 1 ; " ;  
                }
            }
            $sql_void = "DELETE  FROM debt 
           WHERE (payyan IS NULL OR payyan = 0) 
           AND (yayan IS NULL OR yayan = 0)";

            if( $db -> query($sql) === TRUE){
                $Service_Add =  "Service  Add  SUCCESS";
             } else {
                $Service_Add = "Service Add  FAIL". mysqli_error($db) ;
             }
             if( $db -> query($sql_cash) === TRUE){
                $Cash_Update =  "Cash Update  SUCCESS" ;
             } else {
                $Cash_Update = "Cash Update  FAIL". mysqli_error($db) ;
             }
             if( $db -> query($sql_debt) === TRUE){
                $Debt_Update =  "Debt Update  SUCCESS" ;
             } else {
                $Debt_Update = "Debt Update  FAIL". mysqli_error($db) ;
             }
             if( $db -> query($sql_void ) === TRUE){
                $MakeVoid =  "Make Void   SUCCESS";
             } else {
                $MakeVoid =  "Make Void  FAIL";
                }
                $Response[] = array( "Service"=>$Service_Add , "Cash"=>$Cash_Update , "Debt"=> $Debt_Update, "Void"=>$MakeVoid );
              echo json_encode($Response);
         } else {
            $Response[] = array("Data" => "Invalid Input Data");
            echo json_encode($Response);
          }
    }

    function debt(){
        global $DecodedData;
        $db = mysqli_connect('localhost', 'hlakabar_service', '06321421nma06321421nma', 'hlakabar_hkb') or die("Error in Connect DB " . mysqli_error($db));
       if (isset($DecodedData['id']) &&isset($DecodedData['date']) &&isset($DecodedData['payyan']) && isset($DecodedData['yayan']) && isset($DecodedData['paid']) && isset($DecodedData['branch']) ){
           $id = $DecodedData['id'];
           $branch = $DecodedData['branch'];
           $paid = $DecodedData['paid'];
           $payyan = $DecodedData['payyan'];
           $yayan = $DecodedData['yayan'];
           $date = $DecodedData['date'];
           $debtId = $DecodedData['debtId'];
           $str = $DecodedData['description'];
           $description = strtolower($str);
           if ($payyan ==0){
            $sql = "UPDATE debt SET                
            yayan = yayan - $paid  WHERE `id`=$id";
            $sql_cash="UPDATE cash SET yayan=yayan+$paid WHERE gg=concat('Branch_','$branch','  Date - ','$date');";
            $sql_inventory = "UPDATE  $description SET paid=paid+$paid , remain=remain-$paid  WHERE id=$debtId;";
           } else if ($yayan ==0){
            $sql = "UPDATE debt SET                
            payyan = payyan - $paid  WHERE `id`=$id";
            $sql_cash="UPDATE cash SET payyan=payyan-$paid WHERE gg=concat('Branch_','$branch','  Date - ','$date');";
            $sql_inventory = "UPDATE  $description  SET paid=paid+$paid , remain=remain-$paid  WHERE id=$debtId;";
           }
           $sql_void = "DELETE  FROM debt 
           WHERE (payyan IS NULL OR payyan = 0) 
           AND (yayan IS NULL OR yayan = 0)";
           
           if( $db -> query($sql ) === TRUE){
            $UpdateResult =  "Paid Debt   SUCCESS";
         } else {
            $UpdateResult =  "Paid Debt  FAIL";
           }  
         if( $db -> query($sql_cash ) === TRUE){
            $UpdateCash =  "Cash Update   SUCCESS";
           } else {
            $UpdateCash =  "Cash Update  FAIL";
            }  

            if( $db -> query($sql_inventory ) === TRUE){
                $UpdateInventory =  "Inventory Update   SUCCESS";
               } else {
                $UpdateInventory =  "Inventory Update  FAIL";
                }  

            if( $db -> query($sql_void ) === TRUE){
            $MakeVoid =  "Make Void   SUCCESS";
         } else {
            $MakeVoid =  "Make Void  FAIL";
            }
            $Response[] = array( "Debt" => $UpdateResult , "Cash"=>$UpdateCash , "Inventory"=>$UpdateInventory ,"Void"  =>$MakeVoid);

    
          echo json_encode($Response);
     } else {
        $Response[] = array("Data" => "Invalid Input Data");
        echo json_encode($Response);
      }
       
    }

    function getDebt(){
        global $DecodedData;
        $db = mysqli_connect('localhost', 'hlakabar_service', '06321421nma06321421nma', 'hlakabar_hkb') or die("Error in Connect DB " . mysqli_error($db));
        if (isset($DecodedData['filterDate'])){
            $filterDate = $DecodedData['filterDate'];
            if ($filterDate === "all"){
                $sql = "SELECT * FROM debt"; 
        } else if($filterDate === 'tweek') {
            $sql = "SELECT * FROM debt WHERE WEEK(date) = WEEK(NOW()) order by `id` DESC";
        } else if($filterDate === 'pweek') {
            $sql = "SELECT * FROM debt WHERE date >= NOW() + INTERVAL -8 DAY
            AND date <  NOW() + INTERVAL  0 DAY";
        }
        else if($filterDate === 'tmonth') {
            $sql = "SELECT * FROM debt WHERE MONTH(date) = MONTH(NOW()) order by `id` DESC";
        }else if($filterDate === 'pmonth') {
            $sql = "SELECT * FROM debt WHERE date >= NOW() + INTERVAL -31 DAY
            AND date <  NOW() + INTERVAL  0 DAY";
        }
        else if($filterDate === 'tyear') {
            $sql = "SELECT * FROM debt WHERE YEAR(date) = YEAR(NOW()) order by `id` DESC";
        }else if($filterDate === 'pyear') {
            $sql = "SELECT * FROM debt WHERE date >= NOW() + INTERVAL -366 DAY
            AND date <  NOW() + INTERVAL  0 DAY";        
        }
         else if($filterDate === 'today') {
            $sql = "SELECT * FROM debt";
                        //  

        }else if($filterDate === 'jan') {
            $sql = "SELECT * FROM debt WHERE MONTH(date) = 1 ";
        }else if($filterDate === 'feb') {
            $sql = "SELECT * FROM debt WHERE MONTH(date) = 2 ";
        }else if($filterDate === 'mar') {
            $sql = "SELECT * FROM debt WHERE MONTH(date) = 3 ";
        }else if($filterDate === 'apr') {
            $sql = "SELECT * FROM debt WHERE MONTH(date) = 4 ";
        }else if($filterDate === 'may') {
            $sql = "SELECT * FROM debt WHERE MONTH(date) = 5 ";
        }else if($filterDate === 'jun') {
            $sql = "SELECT * FROM debt WHERE MONTH(date) = 6 ";
        }else if($filterDate === 'jul') {
            $sql = "SELECT * FROM debt WHERE MONTH(date) = 7 ";
        }else if($filterDate === 'aug') {
            $sql = "SELECT * FROM debt WHERE MONTH(date) = 8 ";
        }else if($filterDate === 'sep') {
            $sql = "SELECT * FROM debt WHERE MONTH(date) = 9 ";
        }else if($filterDate === 'oct') {
            $sql = "SELECT * FROM debt WHERE MONTH(date) = 10 ";
        }else if($filterDate === 'nov') {
            $sql = "SELECT * FROM debt WHERE MONTH(date) = 11";
        }else if($filterDate === 'dec') {
            $sql = "SELECT * FROM debt WHERE MONTH(date) = 12";
        }

        $result = mysqli_query($db , $sql);
        $rows = [];
        while($row = $result->fetch_assoc()) {
            $rows[] = $row;
        }
            $Response[] = array("Debt" => $rows );
                echo json_encode($Response);
        } else{
            echo "Error Filter Date";
        }
    }

    function multiPurchase(){
        global $DecodedData;
        $db = mysqli_connect('localhost', 'hlakabar_service', '06321421nma06321421nma', 'hlakabar_hkb') or die("Error in Connect DB " . mysqli_error($db));
        if (isset($DecodedData['user']) && isset($DecodedData['payment'])&& isset($DecodedData['itemCode']) && isset($DecodedData['itemName'])&& isset($DecodedData['supplier']) && isset($DecodedData['voucher'])&& isset($DecodedData['qty'])&& isset($DecodedData['amount'])&& isset($DecodedData['discount']) && isset($DecodedData['tax'])&& isset($DecodedData['paid'])&& isset($DecodedData['total'])&& isset($DecodedData['remain']) && isset($DecodedData['branch']) ){
            $user = $DecodedData['user'];
            $payment = $DecodedData['payment'];
            $itemCode = $DecodedData['itemCode'];
            $itemName = $DecodedData['itemName'];
            $lot = $DecodedData['lot'];
            $supplier = $DecodedData['supplier'];
            $voucher = $DecodedData['voucher'];
            $amount = $DecodedData['amount'];
            $discount = $DecodedData['discount'];
            $tax = $DecodedData['tax'];
            $paid = $DecodedData['paid'];
            $total = $DecodedData['total'];
            $remain = $DecodedData['remain'];
            $qty = $DecodedData['qty'];
            $branch = $DecodedData['branch'];
            if(isset($DecodedData['delete'])){
                $id = $DecodedData['id'];
                $pdate = $DecodedData['pdate'];
                $ppaid = $DecodedData['ppaid'];
                $sql = "DELETE FROM sale WHERE id=$id";
                $sql_stock = "UPDATE item SET                
                total = qty + '$qty',                
                qty = qty + '$qty',                
                damage =damage - '$damage' 
                where itemCode=$itemCode AND branch=$branch";
            $sql_cash="UPDATE cash SET sale=sale-$ppaid WHERE gg=concat('Branch_','$branch','  Date - ','$pdate');";
            } else  if(isset($DecodedData['id'])){
                $id = $DecodedData['id'];
                $branch = $DecodedData['branch'];
                $pdate = $DecodedData['pdate'];
                $ppaid = $DecodedData['ppaid'];
                $pqty = $DecodedData['pqty'];
                $sql = "UPDATE sale SET 
                itemCode='$itemCode' ,
                itemName = '$itemName' ,
                lot = '$lot' ,
                supplier='$supplier' , 
                voucher = '$voucher',
                `date` = curdate(),
                user = '$user',
                amount  = $amount ,
                discount = $discount ,
                tax = $tax,
                paid = $paid ,
                total = $total,
                remain = $remain,    
                qty = $qty  WHERE `id`=$id";
             $sql_stock = "UPDATE item SET  
             total = qty + '$pqty' - '$qty',    
             qty = qty + '$pqty' - '$qty'
              where itemCode=$itemCode AND branch=$branch";
             $sql_cash="UPDATE cash SET sale=sale-$ppaid+$paid WHERE gg=concat('Branch_','$branch','  Date - ','$pdate');";
            }else{
                $final_remain = 0;
                for ($i=0; $i < count($itemCode) ; $i++) { 
                    $final_remain += $remain[$i];
                    $sql = "INSERT INTO purchase ( user , itemCode , itemName ,lot ,  supplier , payment ,  voucher  , amount,  discount , tax , paid , total , remain ,  qty , `date`, branch  ) VALUE ('$user' , '$itemCode[$i]' , '$itemName[$i]', '$lot[$i]','$supplier', '$payment' , '$voucher'  , '$amount[$i]' ,  '$discount[$i]' , '$tax[$i]' , '$paid[$i]' , '$total[$i]' , '$remain[$i]'  , '$qty[$i]'  , curdate(), '$branch'  )";       
                     $sql_stock = "UPDATE item SET  
                      total =  qty+$qty[$i],
                     qty =  qty+$qty[$i]
                       where itemCode='$itemCode[$i]' AND branch=$branch";
                    $sql_cash="INSERT INTO cash (gg,purchase ,`date`,branch) VALUES (concat('Branch_',$branch,'  Date - ',curdate()) ,-$paid[$i], curdate(),$branch)
            ON DUPLICATE KEY UPDATE purchase=purchase+(-$paid[$i]);"; 
              
            if( $db -> query($sql ) === TRUE){
                $UpdateResult =  "Insert   SUCCESS";
            } else {
                $UpdateResult =  mysqli_error($db) .  "Insert  FAIL";
            }
            if( $db -> query($sql_cash ) === TRUE){
               $UpdateCash =  "Update Cash   SUCCESS";
            } else {
                $UpdateCash =  "Update Cash  FAIL";
            }
            if( $db -> query($sql_stock ) === TRUE){
                $UpdateStock =  "Update Stock   SUCCESS";
            } else {
                $UpdateStock =  "Update Stock  FAIL";
            }
                }
                if($final_remain != 0){
                $sql_debt = "INSERT INTO debt (debtId , `name` ,payyan , yayan , voucher , `description` ,`date` , branch ) SELECT id , '$supplier' , '$final_remain' , 0 , '$voucher' ,'Purchase', date , branch  FROM purchase ORDER by id desc  LIMIT 1 ; " ;  
                if( $db -> query($sql_debt ) === TRUE){
                    $UpdateDebt =  "Update Debt   SUCCESS";
                } else {
                    $UpdateDebt =  "Update Debt  FAIL  ".mysqli_error($db)    ;
                }
                $Response[] = array( "Result" => $UpdateResult , "Stock"  =>$UpdateStock,"Cash"  =>$UpdateCash , "Debt"=> $UpdateDebt);
            }
                $Response[] = array( "Result" => $UpdateResult , "Stock"  =>$UpdateStock,"Cash"  =>$UpdateCash );

        }
        echo json_encode($Response);
        } else {
            $Response[] = array("Data" => "Invalid Input Data");
            echo json_encode($Response);
        }
    }

    function multiSale(){
        global $DecodedData;
        $db = mysqli_connect('localhost', 'hlakabar_service', '06321421nma06321421nma', 'hlakabar_hkb') or die("Error in Connect DB " . mysqli_error($db));
        // if (isset($DecodedData['user']) && isset($DecodedData['itemCode']) && isset($DecodedData['itemName'])&& isset($DecodedData['customer']) && isset($DecodedData['voucher'])&& isset($DecodedData['qty'])&& isset($DecodedData['amount'])&& isset($DecodedData['discount']) && isset($DecodedData['tax'])&& isset($DecodedData['paid'])&& isset($DecodedData['total'])&& isset($DecodedData['remain']) && isset($DecodedData['branch']) ){
            $user = $DecodedData['user'];
            $itemCode = $DecodedData['itemCode'];
            $itemName = $DecodedData['itemName'];
            $lot = $DecodedData['lot'];
            $customer = $DecodedData['customer'];
            $voucher = $DecodedData['voucher'];
            $amount = $DecodedData['amount'];
            $discount = $DecodedData['discount'];
            $tax = $DecodedData['tax'];
            $paid = $DecodedData['paid'];
            $total = $DecodedData['total'];
            $remain = $DecodedData['remain'];
            $payment = $DecodedData['payment'];
            $qty = $DecodedData['qty'];
            $branch = $DecodedData['branch'];
            
                $final_remain = 0;
                for ($i=0; $i < count($itemCode) ; $i++) { 
                    $final_remain += $remain[$i];
                    $sql = "INSERT INTO sale ( user , itemCode , itemName ,lot ,  customer , voucher  , amount,  discount , tax , paid , total , remain ,  qty , `date`, branch, payment) VALUE ('$user' , '$itemCode[$i]' , '$itemName[$i]', '$lot[$i]','$customer',  '$voucher'  , '$amount[$i]' ,  '$discount[$i]' , '$tax[$i]' , '$paid[$i]' , '$total[$i]' , '$remain[$i]'  , '$qty[$i]'  , curdate(), $branch ,  '$payment')";       
                     $sql_stock = "UPDATE item SET  
                      total =  qty-$qty[$i],
                     qty =  qty-$qty[$i]
                       where itemCode='$itemCode[$i]' AND branch=$branch";

                    
                    $sql_cash="INSERT INTO cash (gg,sale ,`date`,branch) VALUES (concat('Branch_',$branch,'  Date - ',curdate()) ,$paid[$i], curdate(),$branch)
            ON DUPLICATE KEY UPDATE sale=sale+($paid[$i]);";    
                    
            if( $db -> query($sql ) === TRUE){
                $UpdateResult =  "Insert   SUCCESS";
            } else {
                $UpdateResult =  "Insert  FAIL";
            }

            if( $db -> query($sql_cash ) === TRUE){
               $UpdateCash =  "Update Cash   SUCCESS";
            } else {
                $UpdateCash =  "Update Cash  FAIL";
            }
            if( $db -> query($sql_stock ) === TRUE){
                $UpdateStock =  "Update Stock   SUCCESS";
            } else {
                $UpdateStock =  "Update Stock  FAIL";
            }
                }
                $UpdateDebt = "No Debt";
                if($final_remain != 0){
                $sql_debt = "INSERT INTO debt (debtId , `name` ,payyan , yayan , voucher, `description` ,`date` , branch  ) SELECT id , '$customer' , 0,'$final_remain' , '$voucher' , 'Sale' ,date , branch   FROM sale ORDER by id desc  LIMIT 1 ; " ;  
                if( $db -> query($sql_debt ) === TRUE){
                    $UpdateDebt =  "Update Debt   SUCCESS";
                } else {
                    $UpdateDebt =  "Update Debt  FAIL  ".mysqli_error($db)    ;
                }
            }
                $Response[] = array( "Result" => $UpdateResult , "Stock"  =>$UpdateStock,"Cash"  =>$UpdateCash , "Debt"=> $UpdateDebt);   
        
        
        echo json_encode($Response);
        
        // } else {
        //     $Response[] = array("Data" => "Invalid Input Data");
        //     echo json_encode($Response);
        // }
    }

    function getService(){
       global $DecodedData;
        $db = mysqli_connect('localhost', 'hlakabar_service', '06321421nma06321421nma', 'hlakabar_hkb') or die("Error in Connect DB " . mysqli_error($db));
       if (isset($DecodedData['filterDate'])){
            $filterDate = $DecodedData['filterDate'];
            
            if ($filterDate === 'all'){
                
                $sql = "SELECT * FROM `service`"; 
        } else if($filterDate === 'tweek') {
            $sql = "SELECT * FROM `service` WHERE WEEK(date) = WEEK(NOW()) order by `id` DESC";
        } else if($filterDate === 'pweek') {
            $sql = "SELECT * FROM `service` WHERE date >= NOW() + INTERVAL -8 DAY
            AND date <  NOW() + INTERVAL  0 DAY";
        }
        else if($filterDate === 'tmonth') {
            $sql = "SELECT * FROM `service` WHERE MONTH(date) = MONTH(NOW()) order by `id` DESC";
        }else if($filterDate === 'pmonth') {
            $sql = "SELECT * FROM `service` WHERE date >= NOW() + INTERVAL -31 DAY
            AND date <  NOW() + INTERVAL  0 DAY";
        }
        else if($filterDate === 'tyear') {
            $sql = "SELECT * FROM `service` WHERE YEAR(date) = YEAR(NOW()) order by `id` DESC";
        }else if($filterDate === 'pyear') {
            $sql = "SELECT * FROM `service` WHERE date >= NOW() + INTERVAL -366 DAY
            AND date <  NOW() + INTERVAL  0 DAY";        
        }
         else if($filterDate === 'today') {
            //  $sql = "SELECT * FROM `service`"; 
        $sql = "SELECT * FROM `service` WHERE DATE(date) = DATE(NOW()) order by `id` DESC";

        }else if($filterDate === 'jan') {
            $sql = "SELECT * FROM `service` WHERE MONTH(date) = 1 ";
        }else if($filterDate === 'feb') {
            $sql = "SELECT * FROM `service` WHERE MONTH(date) = 2 ";
        }else if($filterDate === 'mar') {
            $sql = "SELECT * FROM `service` WHERE MONTH(date) = 3 ";
        }else if($filterDate === 'apr') {
            $sql = "SELECT * FROM `service` WHERE MONTH(date) = 4 ";
        }else if($filterDate === 'may') {
            $sql = "SELECT * FROM `service` WHERE MONTH(date) = 5 ";
        }else if($filterDate === 'jun') {
            $sql = "SELECT * FROM `service` WHERE MONTH(date) = 6 ";
        }else if($filterDate === 'jul') {
            $sql = "SELECT * FROM `service` WHERE MONTH(date) = 7 ";
        }else if($filterDate === 'aug') {
            $sql = "SELECT * FROM `service` WHERE MONTH(date) = 8 ";
        }else if($filterDate === 'sep') {
            $sql = "SELECT * FROM `service` WHERE MONTH(date) = 9 ";
        }else if($filterDate === 'oct') {
            $sql = "SELECT * FROM `service` WHERE MONTH(date) = 10 ";
        }else if($filterDate === 'nov') {
            $sql = "SELECT * FROM `service` WHERE MONTH(date) = 11";
        }else if($filterDate === 'dec') {
            $sql = "SELECT * FROM `service` WHERE MONTH(date) = 12";
        }
        
        
        $result=mysqli_query($db,$sql);
        while($row=mysqli_fetch_assoc($result)){
            $rows[] = $row;
        }
        $Response[] = array("Service" => $rows  );
                echo json_encode($Response);
        } else{
            echo "Error Filter Date";
        }
    }

    function cash(){
        global $DecodedData;
        $db = mysqli_connect('localhost', 'hlakabar_service', '06321421nma06321421nma', 'hlakabar_hkb') or die("Error in Connect DB " . mysqli_error($db));
        if (isset($DecodedData['id']) && (isset($DecodedData['ge']) ||  isset($DecodedData['adjust']) )) {
            $id = $DecodedData['id'];
            if( isset($DecodedData['ge'])){
                $ge = $DecodedData['ge'];
                $sql_cash="UPDATE cash SET generalExpense=$ge WHERE id=$id;";
            }else if ( isset($DecodedData['adjust'])){
                $adjust = $DecodedData['adjust'];
                $sql_cash="UPDATE cash SET adjust=$adjust WHERE id=$id;";
            }
            if( $db -> query($sql_cash ) === TRUE){
                $UpdateCash =  "Update Cash   SUCCESS";
            } else {
                $UpdateCash =  "Update Cash  FAIL";
            }
            $Response[] = array( "Cash"  =>$UpdateCash);
        }
    }

    function getcash(){
        global $DecodedData;
        $db = mysqli_connect('localhost', 'hlakabar_service', '06321421nma06321421nma', 'hlakabar_hkb') or die("Error in Connect DB " . mysqli_error($db));
        if (isset($DecodedData['filterDate'])){
            $filterDate = $DecodedData['filterDate'];
            if ($filterDate === "all"){
                $sql = "SELECT * FROM cash"; 
        } else if($filterDate === 'tweek') {
            $sql = "SELECT * FROM cash WHERE WEEK(date) = WEEK(NOW()) order by `id` DESC";
        } else if($filterDate === 'pweek') {
            $sql = "SELECT * FROM cash WHERE date >= NOW() + INTERVAL -8 DAY
            AND date <  NOW() + INTERVAL  0 DAY";
        }
        else if($filterDate === 'tmonth') {
            $sql = "SELECT * FROM cash WHERE MONTH(date) = MONTH(NOW()) order by `id` DESC";
        }else if($filterDate === 'pmonth') {
            $sql = "SELECT * FROM cash WHERE date >= NOW() + INTERVAL -31 DAY
            AND date <  NOW() + INTERVAL  0 DAY";
        }
        else if($filterDate === 'tyear') {
            $sql = "SELECT * FROM cash WHERE YEAR(date) = YEAR(NOW()) order by `id` DESC";
        }else if($filterDate === 'pyear') {
            $sql = "SELECT * FROM cash WHERE date >= NOW() + INTERVAL -366 DAY
            AND date <  NOW() + INTERVAL  0 DAY";        
        }
         else if($filterDate === 'today') {
            // $sql = "SELECT * FROM cash";
                        $sql = "SELECT * FROM cash WHERE DATE(date) = DATE(NOW()) order by `id` DESC";

        }else if($filterDate === 'jan') {
            $sql = "SELECT * FROM cash WHERE MONTH(date) = 1 ";
        }else if($filterDate === 'feb') {
            $sql = "SELECT * FROM cash WHERE MONTH(date) = 2 ";
        }else if($filterDate === 'mar') {
            $sql = "SELECT * FROM cash WHERE MONTH(date) = 3 ";
        }else if($filterDate === 'apr') {
            $sql = "SELECT * FROM cash WHERE MONTH(date) = 4 ";
        }else if($filterDate === 'may') {
            $sql = "SELECT * FROM cash WHERE MONTH(date) = 5 ";
        }else if($filterDate === 'jun') {
            $sql = "SELECT * FROM cash WHERE MONTH(date) = 6 ";
        }else if($filterDate === 'jul') {
            $sql = "SELECT * FROM cash WHERE MONTH(date) = 7 ";
        }else if($filterDate === 'aug') {
            $sql = "SELECT * FROM cash WHERE MONTH(date) = 8 ";
        }else if($filterDate === 'sep') {
            $sql = "SELECT * FROM cash WHERE MONTH(date) = 9 ";
        }else if($filterDate === 'oct') {
            $sql = "SELECT * FROM cash WHERE MONTH(date) = 10 ";
        }else if($filterDate === 'nov') {
            $sql = "SELECT * FROM cash WHERE MONTH(date) = 11";
        }else if($filterDate === 'dec') {
            $sql = "SELECT * FROM cash WHERE MONTH(date) = 12";
        }

        $result = mysqli_query($db , $sql);
        $rows = [];
        while($row = $result->fetch_assoc()) {
            $rows[] = $row;
        }
            
            
            $Response[] = array("cashBook" => $rows );
                echo json_encode($Response);
        } else{
            echo "Error Filter Date";
        }
    }

    function sale(){
        global $DecodedData;
        $db = mysqli_connect('localhost', 'hlakabar_service', '06321421nma06321421nma', 'hlakabar_hkb') or die("Error in Connect DB " . mysqli_error($db));
        if (isset($DecodedData['user']) && isset($DecodedData['itemCode']) && isset($DecodedData['itemName'])&& isset($DecodedData['customer']) && isset($DecodedData['voucher'])&& isset($DecodedData['qty'])&& isset($DecodedData['amount'])&& isset($DecodedData['discount']) && isset($DecodedData['tax'])&& isset($DecodedData['paid'])&& isset($DecodedData['total'])&& isset($DecodedData['remain'])&& isset($DecodedData['damage']) && isset($DecodedData['branch']) ){
            $user = $DecodedData['user'];
            $itemCode = $DecodedData['itemCode'];
            $itemName = $DecodedData['itemName'];
            $lot = $DecodedData['lot'];
            $customer = $DecodedData['customer'];
            $voucher = $DecodedData['voucher'];
            $amount = $DecodedData['amount'];
            $discount = $DecodedData['discount'];
            $tax = $DecodedData['tax'];
            $paid = $DecodedData['paid'];
            $total = $DecodedData['total'];
            $remain = $DecodedData['remain'];
            $damage = $DecodedData['damage'];
            $qty = $DecodedData['qty'];
            $branch = $DecodedData['branch'];
            if(isset($DecodedData['delete'])){
                $id = $DecodedData['id'];
                $pdate = $DecodedData['pdate'];
                $ppaid = $DecodedData['ppaid'];
                $sql = "DELETE FROM sale WHERE id=$id";
                $sql_stock = "UPDATE item SET                
                qty = qty + '$qty',                
                damage =damage - '$damage',
                `date` = curdate(),
                 total = qty-damage where itemCode='$itemCode' AND branch=$branch";
            $sql_cash="UPDATE cash SET sale=sale-$ppaid WHERE gg=concat('Branch_','$branch','  Date - ','$pdate');";
            if( $db -> query($sql ) === TRUE){
                $UpdateResult =  "Insert   SUCCESS";
            } else {
                $UpdateResult =  "Insert  FAIL";
            }
            if( $db -> query($sql_stock ) === TRUE){
                $UpdateStock =  "Update Stock   SUCCESS";
            } else {
                $UpdateStock =  "Update Stock  FAIL";
            }
            if( $db -> query($sql_cash ) === TRUE){
                $UpdateCash =  "Update Cash   SUCCESS";
            } else {
                $UpdateCash =  "Update Cash  FAIL";
            }
            $Response[] = array( "Result" => $UpdateResult , "Stock"  =>$UpdateStock,"Cash"  =>$UpdateCash);
            } else  if(isset($DecodedData['id'])){
                $id = $DecodedData['id'];
                $branch = $DecodedData['branch'];
                $pdate = $DecodedData['pdate'];
                $ppaid = $DecodedData['ppaid'];
                $pdamage = $DecodedData['pdamage'];
                $pqty = $DecodedData['pqty'];
                $sql = "UPDATE sale SET 
                itemCode='$itemCode' ,
                itemName = '$itemName' ,
                lot = '$lot' ,
                customer='$customer' , 
                voucher = '$voucher',
                `date` = curdate(),
                user = '$user',
                amount  = $amount ,
                discount = $discount ,
                tax = $tax,
                paid = $paid ,
                total = $total,
                remain = $remain,
                damage =  $damage ,
                qty = $qty  WHERE `id`=$id";

             $sql_stock = "UPDATE item SET  
             qty = qty + '$pqty' - '$qty',    
             `date` = curdate(),            
             damage =damage - '$pdamage' +'$damage',
             total = qty-damage where itemCode='$itemCode' AND branch=$branch";

             $sql_cash="UPDATE cash SET sale=sale-$ppaid+$paid WHERE gg=concat('Branch_','$branch','  Date - ','$pdate');";
             if( $db -> query($sql ) === TRUE){
                $UpdateResult =  "Insert   SUCCESS";
            } else {
                $UpdateResult =  "Insert  FAIL";
            }
            if( $db -> query($sql_stock ) === TRUE){
                $UpdateStock =  "Update Stock   SUCCESS";
            } else {
                $UpdateStock =  "Update Stock  FAIL";
            }
            if( $db -> query($sql_cash ) === TRUE){
                $UpdateCash =  "Update Cash   SUCCESS";
            } else {
                $UpdateCash =  "Update Cash  FAIL";
            }
            $Response[] = array( "Result" => $UpdateResult , "Stock"  =>$UpdateStock,"Cash"  =>$UpdateCash);
            }else{
             $sql = "INSERT INTO sale ( user , itemCode , itemName ,lot ,  customer , voucher  , amount,  discount , tax , paid , total , remain , damage  , qty , `date`, branch ) VALUE ('$user' , '$itemCode' , '$itemName', '$lot','$customer',  '$voucher'  , '$amount' ,  '$discount' , '$tax' , '$paid' , '$total' , '$remain' , '$damage' , '$qty'  , curdate(), $branch)";

             $sql_stock = "UPDATE item SET  
             qty =  qty-$qty,
             `date` = curdate(),
             damage = damage+$damage,
             total = qty-damage where itemCode=$itemCode AND branch=$branch";

             $sql_cash="INSERT INTO cash (gg,sale) VALUES (concat('Branch_',$branch,'  Date - ',curdate()) ,-$paid)
            ON DUPLICATE KEY UPDATE sale=sale+$paid;";

            if( $db -> query($sql ) === TRUE){
                $UpdateResult =  "Insert   SUCCESS";
            } else {
                $UpdateResult =  "Insert  FAIL";
            }
            if( $db -> query($sql_stock ) === TRUE){
                $UpdateStock =  "Update Stock   SUCCESS";
            } else {
                $UpdateStock =  "Update Stock  FAIL";
            }
            if( $db -> query($sql_cash ) === TRUE){
                $UpdateCash =  "Update Cash   SUCCESS";
            } else {
                $UpdateCash =  "Update Cash  FAIL";
            }
            $Response[] = array( "Result" => $UpdateResult , "Stock"  =>$UpdateStock,"Cash"  =>$UpdateCash);
                
        }
        
        echo json_encode($Response);
        
        } else {
            $Response[] = array("Data" => "Invalid Input Data");
            echo json_encode($Response);
        }
    }

    function purchase(){
        global $DecodedData;
        $db = mysqli_connect('localhost', 'hlakabar_service', '06321421nma06321421nma', 'hlakabar_hkb') or die("Error in Connect DB " . mysqli_error($db));
        if (isset($DecodedData['user']) && isset($DecodedData['itemCode']) && isset($DecodedData['itemName'])&& isset($DecodedData['supplier']) && isset($DecodedData['payment'])&& isset($DecodedData['qty'])&& isset($DecodedData['amount'])&& isset($DecodedData['discount']) && isset($DecodedData['tax'])&& isset($DecodedData['paid'])&& isset($DecodedData['total'])&& isset($DecodedData['remain'])&& isset($DecodedData['damage']) && isset($DecodedData['branch']) ){
            $user = $DecodedData['user'];
            $itemCode = $DecodedData['itemCode'];
            $itemName = $DecodedData['itemName'];
            $lot = $DecodedData['lot'];
            $supplier = $DecodedData['supplier'];
            $payment = $DecodedData['payment'];
            $amount = $DecodedData['amount'];
            $discount = $DecodedData['discount'];
            $tax = $DecodedData['tax'];
            $paid = $DecodedData['paid'];
            $total = $DecodedData['total'];
            $remain = $DecodedData['remain'];
            $damage = $DecodedData['damage'];
            $qty = $DecodedData['qty'];
            $branch = $DecodedData['branch'];

            if(isset($DecodedData['delete'])){
                $pdate = $DecodedData['pdate'];
                $ppaid = $DecodedData['ppaid'];
                $id = $DecodedData['id'];
                $branch = $DecodedData['branch'];
                $sql = "DELETE FROM purchase WHERE id=$id";
                $sql_stock = "UPDATE item SET  
                qty = qty - '$qty',                
                damage =damage - '$damage',
                `date` = curdate(),
                 total = qty-damage where itemCode='$itemCode' AND branch=$branch";
                 
                $sql_cash="UPDATE cash SET purchase=purchase+$ppaid WHERE gg=concat('Branch_','$branch','  Date - ','$pdate') ;";
                if( $db -> query($sql ) === TRUE){
                    $UpdateResult =  "  Insert   SUCCESS";
                } else {
                    $UpdateResult =  " Insert  FAIL";
                }
                if( $db -> query($sql_stock ) === TRUE){
                    $UpdateStock =  "Update Stock   SUCCESS";
                } else {
                    $UpdateStock =  "Update Stock  FAIL";
                }
                if( $db -> query($sql_cash ) === TRUE){
                    $UpdateCash =  "Update Cash   SUCCESS";
                } else {
                    $UpdateCash =  "Update Cash  FAIL";
                }
        
                $Response[] = array( "Result" => $UpdateResult , "Stock"  =>$UpdateStock,"Cash"  =>$UpdateCash);
                
            } else  if(isset($DecodedData['id'])){
                $id = $DecodedData['id'];
                $pdamage = $DecodedData['pdamage'];
                $pqty = $DecodedData['pqty'];
                $pdate = $DecodedData['pdate'];
                $ppaid = $DecodedData['ppaid'];
                $branch = $DecodedData['branch'];

                    $sql = "UPDATE purchase SET 
                    itemCode='$itemCode' ,
                    itemName = '$itemName' ,
                    lot = '$lot' ,
                    supplier='$supplier' , 
                    payment = '$payment',
                    `date` = curdate(),
                    user = '$user',
                    amount  = $amount ,
                    discount = $discount ,
                    tax = $tax,
                    paid = $paid ,
                    total = $total,
                    remain = $remain,
                    damage =  $damage ,
                    branch = $branch,
                    qty = $qty  WHERE id=$id ";
    
                    $sql_stock = "UPDATE item SET  
                    qty = qty - '$pqty' +  '$qty',    
                    `date` = curdate(),            
                    damage =damage - '$pdamage' +'$damage',
                     total = qty-damage where itemCode='$itemCode' AND branch=$branch";
    
                    $sql_cash="UPDATE cash SET purchase=purchase+$ppaid+(-$paid) WHERE gg=concat('Branch_','$branch','  Date - ','$pdate');";
                    if( $db -> query($sql ) === TRUE){
                        $UpdateResult =  "  Insert   SUCCESS";
                    } else {
                        $UpdateResult =  " Insert  FAIL";
                    }
                    if( $db -> query($sql_stock ) === TRUE){
                        $UpdateStock =  "Update Stock   SUCCESS";
                    } else {
                        $UpdateStock =  "Update Stock  FAIL";
                    }
                    if( $db -> query($sql_cash ) === TRUE){
                        $UpdateCash =  "Update Cash   SUCCESS";
                    } else {
                        $UpdateCash =  "Update Cash  FAIL";
                    }
            
                    $Response[] = array( "Result" => $UpdateResult , "Stock"  =>$UpdateStock,"Cash"  =>$UpdateCash);
                

                
            }else{    
            $sql_cash="INSERT INTO cash (gg,purchase ,`date`,branch) VALUES (concat('Branch_',$branch,'  Date - ',curdate()) ,-$paid, curdate(),$branch)
            ON DUPLICATE KEY UPDATE purchase=purchase+(-$paid);";    
            $sql = "INSERT INTO purchase ( user , itemCode , itemName ,lot ,  supplier , payment  , amount,  discount , tax , paid , total , remain , damage  , qty ,`date` , branch ) VALUE ('$user' , '$itemCode' , '$itemName', '$lot','$supplier',  '$payment'  , '$amount' ,  '$discount' , '$tax' , '$paid' , '$total' , '$remain' , '$damage' , '$qty', curdate()  , '$branch')";
            $sql_stock = "UPDATE item SET  
             qty =  qty+$qty,
             `date` = curdate(),
             damage = damage+$damage,
             branch = $branch,
             total = qty-damage where itemCode=$itemCode  AND branch=$branch";
             if( $db -> query($sql ) === TRUE){
                $UpdateResult =  "  Insert   SUCCESS";
            } else {
                $UpdateResult =  " Insert  FAIL";
            }
            if( $db -> query($sql_stock ) === TRUE){
                $UpdateStock =  "Update Stock   SUCCESS";
            } else {
                $UpdateStock =  "Update Stock  FAIL";
            }
            if( $db -> query($sql_cash ) === TRUE){
                $UpdateCash =  "Update Cash   SUCCESS";
            } else {
                $UpdateCash =  "Update Cash  FAIL";
            }
    
            $Response[] = array( "Result" => $UpdateResult , "Stock"  =>$UpdateStock,"Cash"  =>$UpdateCash);
        
        
        echo json_encode($Response);
            }

            
        } else {
            $Response[] = array("Data" => "Invalid Input Data");
            echo json_encode($Response);
        }
    }

    function getItem(){
        global $DecodedData;
        $db = mysqli_connect('localhost', 'hlakabar_service', '06321421nma06321421nma', 'hlakabar_hkb') or die("Error in Connect DB " . mysqli_error($db));
        if (isset($DecodedData['filterDate'])){
            $filterDate = $DecodedData['filterDate'];
            if ($filterDate === "all"){
                $sql = "SELECT * FROM item";
                $sql_purchase = "SELECT * FROM purchase";
                $sql_sale = "SELECT * FROM sale";
                
        } else if($filterDate === 'tweek') {
            $sql = "SELECT * FROM item WHERE WEEK(date) = WEEK(NOW()) order by `id` DESC";
            $sql_purchase = "SELECT * FROM purchase WHERE WEEK(date) = WEEK(NOW()) order by `id` DESC";
            $sql_sale = "SELECT * FROM sale WHERE WEEK(date) = WEEK(NOW()) order by `id` DESC";
        } else if($filterDate === 'pweek') {
            $sql = "SELECT * FROM item WHERE date >= NOW() + INTERVAL -8 DAY
            AND date <  NOW() + INTERVAL  0 DAY";
            $sql_purchase = "SELECT * FROM purchase WHERE date >= NOW() + INTERVAL -8 DAY
            AND date <  NOW() + INTERVAL  0 DAY";
            $sql_sale = "SELECT * FROM sale WHERE date >= NOW() + INTERVAL -8 DAY
            AND date <  NOW() + INTERVAL  0 DAY";
        }
        else if($filterDate === 'tmonth') {
            $sql = "SELECT * FROM item WHERE MONTH(date) = MONTH(NOW()) order by `id` DESC";
            $sql_purchase = "SELECT * FROM purchase WHERE MONTH(date) = MONTH(NOW()) order by `id` DESC";
            $sql_sale = "SELECT * FROM sale WHERE MONTH(date) = MONTH(NOW()) order by `id` DESC";
        }else if($filterDate === 'pmonth') {
            $sql = "SELECT * FROM item WHERE date >= NOW() + INTERVAL -31 DAY
            AND date <  NOW() + INTERVAL  0 DAY";
            $sql_purchase = "SELECT * FROM purchase WHERE date >= NOW() + INTERVAL -31 DAY
            AND date <  NOW() + INTERVAL  0 DAY";
            $sql_sale = "SELECT * FROM sale WHERE date >= NOW() + INTERVAL -31 DAY
            AND date <  NOW() + INTERVAL  0 DAY";
        }
        else if($filterDate === 'tyear') {
            $sql = "SELECT * FROM item WHERE YEAR(date) = YEAR(NOW()) order by `id` DESC";
            $sql_purchase = "SELECT * FROM purchase WHERE YEAR(date) = YEAR(NOW()) order by `id` DESC";
            $sql_sale = "SELECT * FROM sale WHERE YEAR(date) = YEAR(NOW()) order by `id` DESC";
        }else if($filterDate === 'pyear') {
            $sql = "SELECT * FROM item WHERE date >= NOW() + INTERVAL -366 DAY
            AND date <  NOW() + INTERVAL  0 DAY";
            $sql_purchase = "SELECT * FROM purchase WHERE date >= NOW() + INTERVAL -366 DAY
            AND date <  NOW() + INTERVAL  0 DAY";
            $sql_sale = "SELECT * FROM sale WHERE date >= NOW() + INTERVAL -366 DAY
            AND date <  NOW() + INTERVAL  0 DAY";
        }
         else if($filterDate === 'today') {
            $sql = "SELECT * FROM item";
            // $sql = "SELECT * FROM item WHERE DATE(date) = DATE(NOW()) order by `id` DESC";
            $sql_purchase = "SELECT * FROM purchase WHERE DATE(date) = DATE(NOW()) order by `id` DESC";
            $sql_sale = "SELECT * FROM sale WHERE DATE(date) = DATE(NOW()) order by `id` DESC";
        }else if($filterDate === 'jan') {
            $sql = "SELECT * FROM item WHERE MONTH(date) = 1 ";
            $sql_purchase = "SELECT * FROM purchase WHERE MONTH(date) = 1 ";
            $sql_sale = "SELECT * FROM sale WHERE MONTH(date) = 1 ";
        }else if($filterDate === 'feb') {
            $sql = "SELECT * FROM item WHERE MONTH(date) = 2 ";
            $sql_purchase = "SELECT * FROM purchase WHERE MONTH(date) = 2 ";
            $sql_sale = "SELECT * FROM sale WHERE MONTH(date) = 2 ";
        }else if($filterDate === 'mar') {
            $sql = "SELECT * FROM item WHERE MONTH(date) = 3 ";
            $sql_purchase = "SELECT * FROM purchase WHERE MONTH(date) = 3 ";
            $sql_sale = "SELECT * FROM sale WHERE MONTH(date) = 3 ";
        }else if($filterDate === 'apr') {
            $sql = "SELECT * FROM item WHERE MONTH(date) = 4 ";
            $sql_purchase = "SELECT * FROM purchase WHERE MONTH(date) = 4 ";
            $sql_sale = "SELECT * FROM sale WHERE MONTH(date) = 4 ";
        }else if($filterDate === 'may') {
            $sql = "SELECT * FROM item WHERE MONTH(date) = 5 ";
            $sql_purchase = "SELECT * FROM purchase WHERE MONTH(date) = 5 ";
            $sql_sale = "SELECT * FROM sale WHERE MONTH(date) = 5 ";
        }else if($filterDate === 'jun') {
            $sql = "SELECT * FROM item WHERE MONTH(date) = 6 ";
            $sql_purchase = "SELECT * FROM purchase WHERE MONTH(date) = 6 ";
            $sql_sale = "SELECT * FROM sale WHERE MONTH(date) = 6 ";
        }else if($filterDate === 'jul') {
            $sql = "SELECT * FROM item WHERE MONTH(date) = 7 ";
            $sql_purchase = "SELECT * FROM purchase WHERE MONTH(date) = 7 ";
            $sql_sale = "SELECT * FROM sale WHERE MONTH(date) = 7 ";
        }else if($filterDate === 'aug') {
            $sql = "SELECT * FROM item WHERE MONTH(date) = 8 ";
            $sql_purchase = "SELECT * FROM purchase WHERE MONTH(date) = 8 ";
            $sql_sale = "SELECT * FROM sale WHERE MONTH(date) = 8 ";
        }else if($filterDate === 'sep') {
            $sql = "SELECT * FROM item WHERE MONTH(date) = 9 ";
            $sql_purchase = "SELECT * FROM purchase WHERE MONTH(date) = 9 ";
            $sql_sale = "SELECT * FROM sale WHERE MONTH(date) = 9 ";
            
        }else if($filterDate === 'oct') {
            $sql = "SELECT * FROM item WHERE MONTH(date) = 10 ";
            $sql_purchase = "SELECT * FROM purchase WHERE MONTH(date) = 10 ";
            $sql_sale = "SELECT * FROM sale WHERE MONTH(date) = 10 ";
        }else if($filterDate === 'nov') {
            $sql = "SELECT * FROM item WHERE MONTH(date) = 11";
            $sql_purchase = "SELECT * FROM purchase WHERE MONTH(date) = 11 ";
            $sql_sale = "SELECT * FROM sale WHERE MONTH(date) = 11 ";
        }else if($filterDate === 'dec') {
            $sql = "SELECT * FROM item WHERE MONTH(date) = 12";
            $sql_purchase = "SELECT * FROM purchase WHERE MONTH(date) = 12 ";
            $sql_sale = "SELECT * FROM sale WHERE MONTH(date) = 12 ";
        }
        $result = mysqli_query($db , $sql);
        $rows = [];
        while($row = $result->fetch_assoc()) {
            $rows[] = $row;
        }
            
            $result_purchase = mysqli_query($db , $sql_purchase);
            $rows_purchase = [];
            while($row_purchase = $result_purchase->fetch_assoc()) {
                $rows_purchase[] = $row_purchase;
            }

            $result_sale = mysqli_query($db , $sql_sale);
            $rows_sale = [];
            while($row_sale = $result_sale->fetch_assoc()) {
                $rows_sale[] = $row_sale;
            }

            $Response[] = array("item" => $rows ,  'purchase'=> $rows_purchase,  'sale'=> $rows_sale);
                echo json_encode($Response);
        } else{
            echo "Error Filter Date";
        }

        
    }
    
    function saveItem(){
        global $DecodedData;
        $db = mysqli_connect('localhost', 'hlakabar_service', '06321421nma06321421nma', 'hlakabar_hkb') or die("Error in Connect DB " . mysqli_error($db));
        if (isset($DecodedData['user']) && isset($DecodedData['itemCode']) && isset($DecodedData['itemName'])&& isset($DecodedData['category']) && isset($DecodedData['branch'])   ){
            $user = $DecodedData['user'];
            $itemCode = $DecodedData['itemCode'];
            $itemName = $DecodedData['itemName'];
            $lot = $DecodedData['lot'];
            $branch = $DecodedData['branch'];
            $category = $DecodedData['category'];
            $note =($DecodedData['note']  ? $DecodedData['note'] : "-" );
            $purchasePrice = ($DecodedData['purchasePrice']  ? $DecodedData['purchasePrice'] : 0 );
            $sellPrice = ($DecodedData['sellPrice']  ? $DecodedData['sellPrice'] : 0 );
            
            if(isset($DecodedData['delete'])){
                $id = $DecodedData['id'];
                $sql = "DELETE FROM item WHERE id=$id";
                if( $db -> query($sql ) === TRUE){
                    $UpdateResult =  "Delete   SUCCESS";
                    } else {
                    $UpdateResult =  "Delete  FAIL" . mysqli_error($db);
                    }
                    $Response[] = array("Result" => $UpdateResult  );
                    echo json_encode($Response);
            } else  if(isset($DecodedData['id'])){
                $id = $DecodedData['id'];
                $sql = "UPDATE item SET 
                itemCode='$itemCode' ,
                itemName = '$itemName' ,
                lot = '$lot',
                branch = '$branch',
                category='$category' , 
                purchasePrice = '$purchasePrice',
                sellPrice = '$sellPrice',
                note = '$note',
                user = '$user',
                `date` = curdate()
                WHERE `id`=$id";
                if( $db -> query($sql ) === TRUE){
                $UpdateResult =  "Update   SUCCESS";
                } else {
                $UpdateResult =  "Update  FAIL" . mysqli_error($db);
                }
                $Response[] = array("Result" => $UpdateResult  );
                echo json_encode($Response);
            } else{
                 if(is_array($branch)){
                    for ($i=0; $i < count($branch) ; $i++) { 
                        $sql = "INSERT INTO item ( user , itemCode , itemName ,lot ,  category , purchasePrice  , sellPrice,  note , `date` , branch ) VALUE ('$user' , '$itemCode' , '$itemName','$lot' ,  '$category',  '$purchasePrice'  , '$sellPrice' ,  '$note', curdate()  , '$branch[$i]' )";
                        if( $db -> query($sql ) === TRUE){
                            $UpdateResult =  "Insert   SUCCESS";
                        } else {
                            $UpdateResult =  "Insert  FAIL";
                        }
                        $Response[] = array("Result" => $UpdateResult  );
                        echo json_encode($Response);
                    }
                }else{

                    $sql = "INSERT INTO item ( user , itemCode , itemName ,lot ,  category , purchasePrice  , sellPrice,  note , `date` , branch ) VALUE ('$user' , '$itemCode' , '$itemName','$lot' ,  '$category',  '$purchasePrice'  , '$sellPrice' ,  '$note', curdate()  , '$branch' )";
                    if( $db -> query($sql ) === TRUE){
                        $UpdateResult =  "Insert   SUCCESS";
                    } else {
                        $UpdateResult =  "Insert  FAIL";
                    }
                    $Response[] = array("Result" => $UpdateResult  );
                    echo json_encode($Response);
                }
            }

            
        }
    }
    
    function create(){

        

        global $db;
        $delSql = "DROP DATABASE IF EXISTS `hlakabar_hkb`";
        if ($db->query($delSql) === TRUE) {
        $Drop =  "Database  Drop OK ...";
        } else {
        $Drop = 'Database Drop  ERROR ...';
        }
        $sql = "CREATE DATABASE IF NOT EXISTS `hlakabar_hkb`";
        if ($db->query($sql) === TRUE) {
        $db = mysqli_connect('localhost', 'hlakabar_service', '06321421nma06321421nma', 'hlakabar_hkb') or die("Error in Connect DB " . mysqli_error($db));
        $CreateDB = "Database Create OK ...";
        } else {
        $CreateDB = "Database Create Error ...";
        }
        $create_table_item = "CREATE TABLE IF NOT EXISTS `item` (
          id INT(100) AUTO_INCREMENT PRIMARY KEY,
           user VARCHAR(100) DEFAULT '',
           itemCode VARCHAR(100) DEFAULT '',
            itemName VARCHAR(100) DEFAULT '',
            lot VARCHAR(100) DEFAULT '',
            category VARCHAR(100) DEFAULT '',
            qty INT(100) DEFAULT 0.00,
            purchasePrice INT(100) DEFAULT 0.00,
            sellPrice INT(100) DEFAULT 0.00,
            sale INT(100) DEFAULT 0.00,
            purhase INT(100) DEFAULT 0.00,
            damage INT(100) DEFAULT 0.00,
            total INT(100) DEFAULT 0,
            note VARCHAR(100) DEFAULT '', 
            branch VARCHAR(100) DEFAULT '',
            `date` VARCHAR(100) DEFAULT ''

            )  ENGINE=MYISAM,CHARACTER SET =utf8;";
            $create_item = mysqli_query($db, $create_table_item) or die("Error in Create Table " . mysqli_error($db));

        $create_table_purchase = "CREATE TABLE IF NOT EXISTS `purchase` (
            id INT(100) AUTO_INCREMENT PRIMARY KEY,
            user VARCHAR(100) DEFAULT '',
            voucher VARCHAR(100) DEFAULT '',
            itemCode VARCHAR(100) DEFAULT '',
            itemName VARCHAR(100) DEFAULT '',
            lot VARCHAR(100) DEFAULT '',
            supplier VARCHAR(100) DEFAULT '',
            payment VARCHAR(100) DEFAULT '',
            qty INT(100) DEFAULT 0.00,
            amount INT(100) DEFAULT 0.00,   
            discount INT(100) DEFAULT 0.00,
            tax INT(100) DEFAULT 0.00,
            total INT(100) DEFAULT 0.00,
            paid INT(100) DEFAULT 0.00,
            remain INT(100) DEFAULT 0.00,
            damage INT(100) DEFAULT 0.00,
            branch VARCHAR(100) DEFAULT '',
            `date` VARCHAR(100) DEFAULT ''
            )  ENGINE=MYISAM,CHARACTER SET =utf8;";
            $create_purchase = mysqli_query($db, $create_table_purchase) or die("Error in Create Table Purchase" . mysqli_error($db));

            $create_table_sale = "CREATE TABLE IF NOT EXISTS `sale` (
                id INT(100) AUTO_INCREMENT PRIMARY KEY,
                user VARCHAR(100) DEFAULT '',
                payment VARCHAR(100) DEFAULT '',
                itemCode VARCHAR(100) DEFAULT '',
                itemName VARCHAR(100) DEFAULT '',
                lot VARCHAR(100) DEFAULT '',
                customer VARCHAR(100) DEFAULT '',
                voucher VARCHAR(100) DEFAULT '',
                qty INT(100) DEFAULT 0.00,
                amount INT(100) DEFAULT 0.00,   
                discount INT(100) DEFAULT 0.00,
                tax INT(100) DEFAULT 0.00,
                total INT(100) DEFAULT 0.00,
                paid INT(100) DEFAULT 0.00,
                remain INT(100) DEFAULT 0.00,
                damage INT(100) DEFAULT 0.00,
                branch VARCHAR(100) DEFAULT '',
                `date` VARCHAR(100) DEFAULT ''
                )  ENGINE=MYISAM,CHARACTER SET =utf8;";
                $create_sale = mysqli_query($db, $create_table_sale) or die("Error in Create Table Sale" . mysqli_error($db));

                $create_table_leger = "CREATE TABLE IF NOT EXISTS cash (
                    id INT(100) AUTO_INCREMENT PRIMARY KEY,
                    `service` INT(100) DEFAULT 0.00,
                    sale INT(100) DEFAULT 0.00,
                    purchase INT(100) DEFAULT 0.00,
                    generalExpense INT(100) DEFAULT 0.00,
                    adjust INT(100) DEFAULT 0.00,
                    payyan INT(100) DEFAULT 0.00, 
                    yayan INT(100) DEFAULT 0.00,
                    `date` VARCHAR(100) DEFAULT '',
                    gg VARCHAR(100) DEFAULT '',
                    branch VARCHAR(100) DEFAULT '',
                    CONSTRAINT `gg` UNIQUE (gg) 
                    )  ENGINE=MYISAM,CHARACTER SET =utf8;";
                    $create_leger = mysqli_query($db, $create_table_leger) or die("Error in Create Table Sale" . mysqli_error($db));

                $create_table_service = "CREATE TABLE IF NOT EXISTS `service` ( 
                    id INT(100) AUTO_INCREMENT PRIMARY KEY,
                    branch VARCHAR(100) DEFAULT '',
                    user VARCHAR(100) DEFAULT '',
                    customer VARCHAR(100)DEFAULT '',
                    phone VARCHAR(100) DEFAULT '',
                    voucher VARCHAR(100) DEFAULT '',
                    brand VARCHAR(100) DEFAULT '',
                    model VARCHAR(100) DEFAULT '',
                    imei VARCHAR(100) DEFAULT '',
                    color VARCHAR(100) DEFAULT '',
                    error VARCHAR(1000) DEFAULT '',
                    remark VARCHAR(1000) DEFAULT '',
                    `date` VARCHAR(100) DEFAULT '',
                    service_return VARCHAR(100) DEFAULT '',
                    due_date VARCHAR(1000) DEFAULT '',
                    `condition` VARCHAR(100) DEFAULT '',
                    return_date VARCHAR (100) DEFAULT '',
                    warranty VARCHAR (100) DEFAULT '',
                    progress VARCHAR(100) DEFAULT '',
                    engineer VARCHAR(100) DEFAULT '',
                    service_reply VARCHAR(1000) DEFAULT '',
                    item VARCHAR(100) DEFAULT '',
                    service_charges INT(100) DEFAULT 0.00,
                    expense INT (100) DEFAULT 0.00 , 
                    paid INT (100) DEFAULT 0.00 , 
                    remain INT(100) DEFAULT 0.00,
                    profit INT(100) DEFAULT 0.00
                    ) ENGINE=MYISAM,CHARACTER SET =utf8;";
                $create_service = mysqli_query($db, $create_table_service) or die("Error in Create Table Sale" . mysqli_error($db));

                
                    $create_table_debt = "CREATE TABLE IF NOT EXISTS debt (
                        id INT(100) AUTO_INCREMENT PRIMARY KEY,
                        debtId INT(100) DEFAULT 0,
                        `name` VARCHAR(100) DEFAULT '',
                        payyan INT(100) DEFAULT 0,
                        yayan INT(100) DEFAULT 0,
                        branch VARCHAR(100) DEFAULT '',
                        `description`  VARCHAR(100) DEFAULT '',
                        voucher VARCHAR(100) DEFAULT '',
                        `date` VARCHAR(100) DEFAULT ''
                        )  ENGINE=MYISAM,CHARACTER SET =utf8;";
                        $create_debt = mysqli_query($db, $create_table_debt) or die("Error in Create Table Sale" . mysqli_error($db));
           
                if($create_item){
                $item_create = "Create Item Table OK";
            } else {
                $item_create = "Create Item Table ERROR";
            }

            if($create_purchase){
                $purchase_create = "Create Purchase Table OK";
            } else {
                $purchase_create = "Create Purchase Table ERROR";
            }

            if($create_sale){
                $sale_create = "Create Sale Table OK";
            } else {
                $sale_create = "Create Sale Table ERROR";
            }
            if($create_leger){
                $leger_create = "Create Sale Table OK";
            } else {
                $leger_create = "Create Sale Table ERROR";
            }
            if($create_service){
                $service_create = "Create Sale Table OK";
            } else {
                $service_create = "Create Sale Table ERROR";
            }
            if($create_debt){
                $debt_create = "Create Sale Table OK";
            } else {
                $debt_create = "Create Sale Table ERROR";
            }


            $Response[] = array("ITEM" => $item_create , "Purchase" => $purchase_create, "Sale" => $sale_create , "Cash Book"=>$leger_create , "Service"=> $service_create , "Debt"=>$debt_create  );
            echo json_encode($Response);
   
   
        }

    function notFound(){
        echo "<h1>404 Not Found</h1>";
    }