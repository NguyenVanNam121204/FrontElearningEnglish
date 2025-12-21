import React, { useEffect, useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import "./PaymentHistory.css";
import MainHeader from "../../Components/Header/MainHeader";
import { paymentService } from "../../Services/paymentService";
import PaymentHistoryItem from "../../Components/PaymentHistory/PaymentHistoryItem/PaymentHistoryItem";
import PaymentDetailModal from "../../Components/PaymentHistory/PaymentDetailModal/PaymentDetailModal";

export default function PaymentHistory() {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [selectedTransaction, setSelectedTransaction] = useState(null);
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [loadingDetail, setLoadingDetail] = useState(false);

    useEffect(() => {
        const fetchTransactionHistory = async () => {
            try {
                setLoading(true);
                setError("");

                const response = await paymentService.getAllHistory();
                if (response.data?.success && response.data?.data) {
                    const transactionsData = response.data.data || [];
                    setTransactions(transactionsData);
                } else {
                    setError(
                        response.data?.message || "Không thể tải lịch sử thanh toán"
                    );
                }
            } catch (err) {
                console.error("Error fetching transaction history:", err);
                setError("Không thể tải dữ liệu lịch sử thanh toán");
            } finally {
                setLoading(false);
            }
        };

        fetchTransactionHistory();
    }, []);

    const handleItemClick = async (paymentId) => {
        try {
            setLoadingDetail(true);
            const response = await paymentService.getTransactionDetail(paymentId);
            if (response.data?.success && response.data?.data) {
                setSelectedTransaction(response.data.data);
                setShowDetailModal(true);
            } else {
                setError(response.data?.message || "Không thể tải chi tiết giao dịch");
            }
        } catch (err) {
            console.error("Error fetching transaction detail:", err);
            setError("Không thể tải chi tiết giao dịch");
        } finally {
            setLoadingDetail(false);
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return "-";
        const date = new Date(dateString);
        return date.toLocaleDateString("vi-VN", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case 1: // Pending
                return { text: "Đang chờ", variant: "warning" };
            case 2: // Completed
                return { text: "Hoàn thành", variant: "info", customClass: "status-completed" };
            case 3: // Failed
                return { text: "Thất bại", variant: "danger" };
            default:
                return { text: "Không xác định", variant: "secondary" };
        }
    };

    if (loading) {
        return (
            <>
                <MainHeader />
                <div className="payment-history-container">
                    <Container>
                        <div className="loading-message">Đang tải...</div>
                    </Container>
                </div>
            </>
        );
    }

    if (error && transactions.length === 0) {
        return (
            <>
                <MainHeader />
                <div className="payment-history-container">
                    <Container>
                        <div className="error-message">{error}</div>
                    </Container>
                </div>
            </>
        );
    }

    return (
        <>
            <MainHeader />
            <div className="payment-history-container">
                <Container>
                    <div className="payment-history-header">
                        <h1 className="payment-history-title">Lịch sử thanh toán</h1>
                        <p className="payment-history-subtitle">
                            Tổng số giao dịch: <span className="count-badge">{transactions.length}</span>
                        </p>
                    </div>

                    {transactions.length === 0 ? (
                        <div className="empty-state">
                            <p>Bạn chưa có giao dịch nào.</p>
                            <p className="empty-state-hint">
                                Các giao dịch thanh toán của bạn sẽ hiển thị tại đây.
                            </p>
                        </div>
                    ) : (
                        <div className="payment-list-container">
                            <div className="payment-list-header">
                                <div className="payment-header-column product-column">
                                    <span>Sản phẩm</span>
                                </div>
                                <div className="payment-header-column amount-column">
                                    <span>Số tiền</span>
                                </div>
                                <div className="payment-header-column status-column">
                                    <span>Trạng thái</span>
                                </div>
                                <div className="payment-header-column date-column">
                                    <span>Ngày thanh toán</span>
                                </div>
                            </div>

                            <div className="payment-list">
                                {transactions.map((transaction) => {
                                    const statusBadge = getStatusBadge(transaction.status || transaction.Status);
                                    return (
                                        <PaymentHistoryItem
                                            key={transaction.paymentId || transaction.PaymentId}
                                            transaction={transaction}
                                            statusBadge={statusBadge}
                                            formatDate={formatDate}
                                            onClick={() => handleItemClick(transaction.paymentId || transaction.PaymentId)}
                                        />
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </Container>
            </div>

            <PaymentDetailModal
                isOpen={showDetailModal}
                onClose={() => {
                    setShowDetailModal(false);
                    setSelectedTransaction(null);
                }}
                transaction={selectedTransaction}
                loading={loadingDetail}
            />
        </>
    );
}

