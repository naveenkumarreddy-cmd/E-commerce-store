<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>Insert title here</title>
</head>
<body>

</body>

<h1 style="color:green">Your Response has been registered successfully</h1>

<h1 style="color:orange">Name:<%= request.getAttribute("myname") %></h1>
<h1 style="color:blue">Email:<%= request.getAttribute("myemail") %></h1>
<h1 style="color:blue">Department:<%= request.getAttribute("mydept") %></h1>
<h1 style="color:yellow">Address:<%= request.getAttribute("myaddress") %></h1>
<h1 style="color:red">Salary:<%= request.getAttribute("mysalary") %></h1>


</html>