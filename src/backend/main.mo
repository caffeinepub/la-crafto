import Map "mo:core/Map";
import Text "mo:core/Text";
import Array "mo:core/Array";
import List "mo:core/List";
import Order "mo:core/Order";
import Iter "mo:core/Iter";
import Runtime "mo:core/Runtime";
import Stripe "stripe/stripe";
import Nat "mo:core/Nat";
import AccessControl "authorization/access-control";
import MixinAuthorization "authorization/MixinAuthorization";
import OutCall "http-outcalls/outcall";
import Principal "mo:core/Principal";
import Time "mo:core/Time";

actor {
  // Types
  type Product = {
    id : Text;
    name : Text;
    description : Text;
    priceInCents : Nat;
    category : Text;
    imageUrl : Text;
    story : Text;
    engravingAvailable : Bool;
  };

  module Product {
    public func compare(product1 : Product, product2 : Product) : Order.Order {
      Text.compare(product1.category, product2.category);
    };
  };

  public type CartItem = {
    productId : Text;
    quantity : Nat;
  };

  public type OrderItem = {
    product : Product;
    quantity : Nat;
    engravingText : ?Text;
  };

  public type Order = {
    orderId : Text;
    items : [OrderItem];
    totalAmount : Nat;
    orderStatus : {
      #pending;
      #paid : { stripeSessionId : Text };
      #shipped;
    };
    customer : Principal;
    checkoutSessionId : ?Text;
  };

  public type ContactMessage = {
    name : Text;
    email : Text;
    message : Text;
  };

  // Storage
  let products = Map.empty<Text, Product>();
  let carts = Map.empty<Principal, [CartItem]>();
  let orders = Map.empty<Text, Order>();
  let contactMessages = List.empty<ContactMessage>();

  // Categories
  let categories = ["Sacred Wall Art", "3D Printed Buddhist Symbols", "Custom Name Plates", "Himalayan Inspired Decor"];

  // Stripe config
  let accessControlState = AccessControl.initState();
  var stripeConfig : ?Stripe.StripeConfiguration = null;
  include MixinAuthorization(accessControlState);

  // Product CRUD
  public query func getProducts() : async [Product] {
    let productsArray = products.values().toArray();
    let sortedProducts = productsArray.sort();
    sortedProducts;
  };

  public shared ({ caller }) func addProduct(product : Product) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can add products");
    };
    products.add(product.id, product);
  };

  // Cart
  public shared ({ caller }) func addToCart(productId : Text, quantity : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can add to cart");
    };
    if (quantity == 0) {
      Runtime.trap("Quantity must be greater than 0");
    };
    let cart = switch (carts.get(caller)) {
      case (null) { [] };
      case (?items) { items };
    };
    let existingItemIndex = cart.keys().toArray().findIndex(func(i) { cart[i].productId == productId });
    let updatedCart = switch (existingItemIndex) {
      case (?index) {
        cart.keys().toArray().map(
          func(i) {
            if (i == index) { { productId; quantity } } else { cart[i] };
          }
        );
      };
      case (null) { cart.concat([{ productId; quantity }]) };
    };
    carts.add(caller, updatedCart);
  };

  public query ({ caller }) func getCart() : async [CartItem] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view cart");
    };
    switch (carts.get(caller)) {
      case (null) { [] };
      case (?cart) { cart };
    };
  };

  public shared ({ caller }) func clearCart() : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can clear cart");
    };
    carts.remove(caller);
  };

  // Orders
  public shared ({ caller }) func createOrder(items : [OrderItem]) : async ?Order {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can create orders");
    };
    let totalAmount = items.values().toArray().foldLeft(0, func(acc, item) { acc + (item.quantity * item.product.priceInCents) });
    let orderId = systemTime().toText();
    let newOrder = {
      orderId;
      items;
      totalAmount;
      orderStatus = #pending;
      customer = caller;
      checkoutSessionId = null;
    };
    orders.add(orderId, newOrder);
    carts.remove(caller);
    ?newOrder;
  };

  public query ({ caller }) func getUserOrders() : async [Order] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view orders");
    };
    orders.values().toArray().filter(
      func(order) { order.customer == caller }
    );
  };

  public shared ({ caller }) func getAllOrders() : async [Order] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view all orders");
    };
    orders.values().toArray();
  };

  // Contact messages
  public shared ({ caller }) func submitContactMessage(message : ContactMessage) : async () {
    contactMessages.add(message);
  };

  public shared ({ caller }) func getContactMessages() : async [ContactMessage] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view messages");
    };
    contactMessages.toArray();
  };

  // Stripe integration
  public shared ({ caller }) func setStripeConfiguration(config : Stripe.StripeConfiguration) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can set Stripe config");
    };
    stripeConfig := ?config;
  };

  public query func isStripeConfigured() : async Bool {
    stripeConfig != null;
  };

  public query func transform(input : OutCall.TransformationInput) : async OutCall.TransformationOutput {
    OutCall.transform(input);
  };

  func getStripeConfiguration() : Stripe.StripeConfiguration {
    switch (stripeConfig) {
      case (null) { Runtime.trap("Stripe needs to be first configured") };
      case (?value) { value };
    };
  };

  public func getStripeSessionStatus(sessionId : Text) : async Stripe.StripeSessionStatus {
    await Stripe.getSessionStatus(getStripeConfiguration(), sessionId, transform);
  };

  public shared ({ caller }) func createCheckoutSession(items : [Stripe.ShoppingItem], successUrl : Text, cancelUrl : Text) : async Text {
    await Stripe.createCheckoutSession(getStripeConfiguration(), caller, items, successUrl, cancelUrl, transform);
  };

  // Helper function for unique IDs
  func systemTime() : Nat {
    Time.now().toNat();
  };

  // Seed initial products
  public shared ({ caller }) func seedProducts() : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can seed products");
    };
    let sacredWallArt = {
      id = "sacredWallArt1";
      name = "Tibetan Thangka Print";
      description = "Beautiful Thangka wall hanging";
      priceInCents = 4999;
      category = "Sacred Wall Art";
      imageUrl = "https://lacrafto.com/images/thangka.jpg";
      story = "Inspired by traditional Tibetan Buddhist art";
      engravingAvailable = false;
    };
    let buddhistSymbol = {
      id = "buddhistSymbol1";
      name = "3D Printed Om Mani Padme Hum";
      description = "Symbol of compassion and wisdom";
      priceInCents = 1999;
      category = "3D Printed Buddhist Symbols";
      imageUrl = "https://lacrafto.com/images/ommani.jpg";
      story = "Represents the path to enlightenment in Buddhism";
      engravingAvailable = true;
    };
    let namePlate = {
      id = "namePlate1";
      name = "Custom Ladakh Name Plate";
      description = "Personalized name plate with Ladakhi design";
      priceInCents = 2999;
      category = "Custom Name Plates";
      imageUrl = "https://lacrafto.com/images/nameplate.jpg";
      story = "Blending traditional and modern art";
      engravingAvailable = true;
    };
    let decor = {
      id = "decor1";
      name = "Himalayan Yak Figurine";
      description = "Handcrafted keepsake from Ladakh";
      priceInCents = 1499;
      category = "Himalayan Inspired Decor";
      imageUrl = "https://lacrafto.com/images/yak.jpg";
      story = "Symbolizes the enduring strength of Himalayan culture";
      engravingAvailable = false;
    };
    products.add(sacredWallArt.id, sacredWallArt);
    products.add(buddhistSymbol.id, buddhistSymbol);
    products.add(namePlate.id, namePlate);
    products.add(decor.id, decor);
  };
};
