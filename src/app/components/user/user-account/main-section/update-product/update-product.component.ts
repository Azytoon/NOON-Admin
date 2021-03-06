import{FormGroup,FormControl,FormBuilder, Validators} from '@angular/forms'
import { AddingProductsServiceService } from 'src/app/services/adding-products-service.service';
import { Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { ProductAPI } from 'src/app/models/product-api';
import { Category } from 'src/app/models/category';
import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { CatrgoriesFromApiService } from 'src/app/services/catrgories-from-api.service';
import { ProductsFromAPIService } from 'src/app/services/products-from-api.service';

@Component({
  selector: 'app-update-product',
  templateUrl: './update-product.component.html',
  styleUrls: ['./update-product.component.scss']
})
export class UpdateProductComponent implements OnInit,OnChanges {
  sentPrdID:any;
  newURL:String='ahmad';
  notAdded:boolean=false;
  nameths:String='';
  prd:ProductAPI={} as ProductAPI
  wantedProduct!:ProductAPI;
  myForm: FormGroup;
  CatList:string[]=[];
  private subscriptionsAdmin:Subscription[]=[];
  constructor(private fb: FormBuilder,private prdSerAPI: ProductsFromAPIService,private catSerAPI: CatrgoriesFromApiService,private ProductInserteAPI:AddingProductsServiceService , private activatedRoute: ActivatedRoute) {

    this.myForm=this.fb.group({
      id:Date.now(),
      title:['',[Validators.required,Validators.minLength(10)]],
      desc:['',[Validators.required,Validators.minLength(20),Validators.maxLength(150)]],
      price:['',[Validators.required,Validators.min(1)]],
      quantity:['',[Validators.min(1),Validators.max(100)]],
      imageSrc:[''],
      categories:['']

    })
   }
  
  ngOnInit(): void {
    // this.catAPI.getallCategories()
    // .subscribe(categoriesList=>{
    //   this.catList=categoriesList;
    // })
    this.sentPrdID=this.activatedRoute.snapshot.paramMap.get("id")
    this.myForm.valueChanges.subscribe() 

    this.prdSerAPI.getProductByID(this.sentPrdID)
    .subscribe(wantedProduct => {
      this.wantedProduct = wantedProduct;
      console.log(this.wantedProduct)
      this.myForm.controls['title'].patchValue(this.wantedProduct.title);
      this.myForm.controls['quantity'].patchValue(this.wantedProduct.quantity);
      this.myForm.controls['desc'].patchValue(this.wantedProduct.desc);
      this.myForm.controls['price'].patchValue(this.wantedProduct.price);
      this.myForm.controls['imageSrc'].patchValue(this.wantedProduct.imageSrc);
      this.myForm.controls['categories'].patchValue(this.wantedProduct.categories);

    },
      err => {
        console.log(err);
      });


    this.catSerAPI.getAllCategories()
    .subscribe(catList => {
      this.CatList = catList;
      //console.log("hamooooooooooo",this.CatList)
    },
      err => {
        //console.log("erooooooor",this.CatList)
        console.log(err);
      });
  }

  ngOnChanges(changes: SimpleChanges): void {
    // this.myForm.controls['ImgUrl'].setValue(this.newURL);
  }


  editProduct(prd:ProductAPI,prdId:string){
   console.log("this is working",prd);
    this.subscriptionsAdmin.push(
      this.ProductInserteAPI.editProduct(prd,prdId)
      .subscribe(newProd=>
        {prd=newProd;
          console.log(prd)
          console.log(newProd)
        }
        ))
     alert(`you have edited ${prd.title}, Successfully.!`);
  }

  upload(event:any){
    var file= event.target.files[0];
    this.newURL=file.name;
    console.log(file.name);
    console.log("newURl",this.newURL)
    this.myForm.controls['imageSrc'].patchValue(this.newURL);
    console.log("image name",this.myForm.controls['imageSrc'].value);
      this.ProductInserteAPI.uploadimage(file).subscribe((d)=>{
      console.log("New file",d);
    },error=>{console.error(error);
    });
   }

   uploadMulti(event:any){
    const files:FileList= event.target.files;
    console.log(files);
    this.ProductInserteAPI.uploadImages(files).subscribe((d)=>{  
      console.log(d);
    },error=>{console.error(error);});

   }
  }

