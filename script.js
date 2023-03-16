var app = angular.module("webshop", ["ui.router"])
	.config(function($stateProvider, $urlRouterProvider, $locationProvider) {
	$urlRouterProvider.otherwise("/home");
	$stateProvider
	.state("home", {
		url: "/home",
		templateUrl:"./templates/home.html",
		controller:"homeController",
		controllerAs: "homeCtrl"

	})	
	.state("ProductDetails", {
			url: "/productDetails/:id",
			templateUrl: "./templates/productDetails.html",
			controller: "productDetailsController",
			controllerAs: "productDetailsCtrl"
		})	
		$locationProvider.html5Mode(true);
	})

	
.controller("homeController", homeController)
.controller("productDetailsController", productDetails)
.controller("productSearchController", productSearch)

	function homeController($http, $state){
		var vm = this;
  
			vm.cartIsOpen = false; 
			vm.toggleCart = function() {
		
				vm.cartIsOpen = !vm.cartIsOpen;
			};
			var vm = this
			vm.cart=[];
			$http.get("http://localhost:3000/products")
                .then(function(response){
                  vm.products = response.data;
				  console.log(vm.products)
                });

				vm.searchTerm = ""; // searcTerm za search product

				vm.searchProduct = function(){
					if(vm.name){
						$state.go("productSearch", {name: vm.name})}
				}
				
				vm.addtoCart = function(product) {
					var existingProduct = vm.cart.find(function(item) {
					  return item.id === product.id;
					});
					if (existingProduct) {
					  existingProduct.quantity++;
					} else { 
					  product.quantity = 1;
					  vm.cart.push(product);
					}
				  };

				vm.cartTotal = function() {
					var totalPrice = 0;
					angular.forEach(vm.cart, function(product) {
						totalPrice += product.price * product.quantity;
					});
					return totalPrice;
				};

			vm.removeProduct = function(product) {
				var index = vm.cart.indexOf(product);
				vm.cart.splice(index, 1);

			};

		this.buyOrder = function() {
			var orderProducts = [];
	
			angular.forEach(vm.cart, function(product) {
			orderProducts.push({
				id: product.id,
				name: product.name,
				price: product.price,
				quantity: product.quantity
			});
			});
		
		var order = {
		  products: orderProducts,
		  total: vm.cartTotal()
		};
	
		$http.post('http://localhost:3000/orders', order)
		  .then(function(response){
			alert('Order successful!');
		  });
		this.cart = [];
	  };
	  vm.filterProducts = function(product) {
		return vm.searchTerm == "" || product.name.toLowerCase().indexOf(vm.searchTerm.toLowerCase()) !== -1;
	 }

	}
	
	function productDetails($http, $stateParams){
		var vm = this;

		$http({
			url:"http://localhost:3000/products",
			params:{id:$stateParams.id},
			method:"get"
		})
		.then(function(response){
			
			vm.product = response.data[0]
			console.log(response)
		})
	 }

	