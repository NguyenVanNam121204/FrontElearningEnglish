import React from "react";
import { MdEdit, MdDelete, MdVisibility, MdMenuBook } from "react-icons/md";
import "./CourseTable.css";

export default function CourseTable({ 
  courses, 
  loading, 
  onView, 
  onEdit, 
  onDelete 
}) {
  const formatPrice = (price) => {
    if (price === 0 || !price) {
      return <span className="price-free">Free</span>;
    }
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  const getTypeBadge = (type) => {
    return type === 1 
      ? <span className="type-badge type-system">System</span> 
      : <span className="type-badge type-teacher">Teacher</span>;
  };

  return (
    <div className="course-table-container">
      <div className="table-responsive">
        <table className="course-table">
          <thead>
            <tr>
              <th style={{width: '35%'}}>Course Name</th>
              <th>Instructor</th>
              <th>Type</th>
              <th>Price</th>
              <th>Students</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="6" className="text-center py-4">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                </td>
              </tr>
            ) : courses.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center py-4 text-muted">
                  No courses found
                </td>
              </tr>
            ) : (
              courses.map((course) => (
                <tr key={course.courseId}>
                  <td>
                    <div className="course-info">
                      {course.imageUrl ? (
                        <img 
                          src={course.imageUrl} 
                          alt="Course" 
                          className="course-thumbnail"
                        />
                      ) : (
                        <div className="course-thumbnail-placeholder">
                          <MdMenuBook size={20} />
                        </div>
                      )}
                      <div className="course-details">
                        <div className="course-title">{course.title}</div>
                        <div className="course-id">ID: #CRS-{course.courseId}</div>
                      </div>
                    </div>
                  </td>
                  <td className="text-muted">{course.teacherName || "System Admin"}</td>
                  <td>{getTypeBadge(course.type)}</td>
                  <td>{formatPrice(course.price)}</td>
                  <td className="text-center">{course.studentCount || 0}</td>
                  <td>
                    <div className="action-buttons">
                      <button 
                        className="action-btn action-view" 
                        title="View Details"
                        onClick={() => onView(course.courseId)}
                      >
                        <MdVisibility />
                      </button>
                      <button 
                        className="action-btn action-edit" 
                        title="Edit"
                        onClick={() => onEdit(course)}
                      >
                        <MdEdit />
                      </button>
                      <button 
                        className="action-btn action-delete" 
                        title="Delete"
                        onClick={() => onDelete(course.courseId)}
                      >
                        <MdDelete />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
