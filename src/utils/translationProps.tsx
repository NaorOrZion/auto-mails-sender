export default {
    uploadStep: {
      title: "העלאת קובץ אקסל",
      manifestTitle: "אנחנו מצפים שהקובץ אקסל יראה כך:",
      manifestDescription: "(תהיה לכם אפשרות לשנות/למחוק תאים בצעדים הבאים)",
      maxRecordsExceeded: (maxRecords: string) => `יותר מדיי שורות. עד ${maxRecords} שורות מותרות`,
      dropzone: {
        title: "קבצים נתמכים: .xlsx, .xls, .csv",
        errorToastDescription: "העלאה נכשלה",
        activeDropzoneTitle: "יש לגרור את הקובץ לכאן",
        buttonTitle: "בחרו קובץ",
        loadingTitle: "מעבד...",
      },
      selectSheet: {
        title: "בחרו את הגיליון שבו תרצו להשתמש",
        nextButtonTitle: "הבא",
        backButtonTitle: "חזרה",
      },
    },
    selectHeaderStep: {
      title: "בחירת שורת הכותרת",
      nextButtonTitle: "הבא",
      backButtonTitle: "חזרה",
    },
    matchColumnsStep: {
      title: "התאמת עמודות",
      nextButtonTitle: "הבא",
      backButtonTitle: "חזרה",
      userTableTitle: "הטבלה שלכם",
      templateTitle: "הכותרות שייכות לעמודות הבאות",
      selectPlaceholder: "בחרו עמודה...",
      ignoredColumnText: "ניתן להתעלם מעמודה זו",
      subSelectPlaceholder: "בחרו...",
      matchDropdownTitle: "יש התאמה",
      unmatched: "חוסר התאמה",
      duplicateColumnWarningTitle: "אי אפשר לבחור את אותה הכותרת פעמיים!",
      duplicateColumnWarningDescription: "עמודות חייבות להיות עם כותרת ייחודית",
    },
    validationStep: {
      title: "וידוא מידע",
      nextButtonTitle: "אישור",
      backButtonTitle: "חזרה",
      noRowsMessage: "מידע לא נמצא",
      noRowsMessageWhenFiltered: "אין שגיאות :)",
      discardButtonTitle: "מחיקת השורות שנבחרו",
      filterSwitchTitle: "להראות רק את השורות עם השגיאות",
    },
    alerts: {
      confirmClose: {
        headerTitle: "יציאה מהתהליך",
        bodyText: "בטוח? המידע לא יישמר",
        cancelButtonTitle: "ביטול",
        exitButtonTitle: "יציאה מהתהליך",
      },
      submitIncomplete: {
        headerTitle: "נמצאו שגיאות!",
        bodyText: "יש עדיין שורות עם שגיאה בתוכן. שורות עם שגיאות יתעלמו בעת הגשה.",
        bodyTextSubmitForbidden: "יש עדיין שורות עם שגיאה בהן.",
        cancelButtonTitle: "ביטול",
        finishButtonTitle: "הגשה",
      },
      submitError: {
        title: "שגיאה",
        defaultMessage: "אופס! קרתה שגיאה בזמן הגשת הטופס.",
      },
      unmatchedRequiredFields: {
        headerTitle: "לא כל העמודות תואמות",
        bodyText: "יש עמודות חובה שלא תואמות או שנבחר להתעלם מהן. האם ברצונך להמשיך?",
        listTitle: "עמודות שלא תואמות:",
        cancelButtonTitle: "ביטול",
        continueButtonTitle: "להמשיך",
      },
      toast: {
        error: "שגיאה",
      },
    },
  }
  