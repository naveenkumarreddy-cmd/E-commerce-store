


package com.nkr.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

	
	@Entity
	@Table(name = "payments")
	public class Payment {

	    @Id
	    @GeneratedValue(strategy = GenerationType.IDENTITY)
	    private Long id;

	    private double amount;

	    @ManyToOne
	    @JoinColumn(name = "order_id")
	    private Order order;

	    @Column(name = "payment_method")
	    private String paymentMethod;

	    @Column(name="payment_status")
	    private String status;
	    
	    private LocalDateTime paymentDate;
	    
	    // ===== Constructors =====
	    public Payment() {}

		public Long getId() {
			return id;
		}

		public void setId(Long id) {
			this.id = id;
		}

		public double getAmount() {
			return amount;
		}

		public void setAmount(double amount) {
			this.amount = amount;
		}

		public Order getOrder() {
			return order;
		}

		public void setOrder(Order order) {
			this.order = order;
		}

		public String getPaymentMethod() {
			return paymentMethod;
		}

		public void setPaymentMethod(String paymentMethod) {
			this.paymentMethod = paymentMethod;
		}

		public String getStatus() {
			return status;
		}

		public void setStatus(String status) {
			this.status = status;
		}

}
